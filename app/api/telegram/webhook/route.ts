import sharp from "sharp"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type TelegramPhotoSize = { file_id: string; file_unique_id: string; width: number; height: number; file_size?: number }
type TelegramMessage = {
  message_id: number
  date: number
  chat: { id: number; type: string; username?: string; first_name?: string; last_name?: string }
  from?: { id: number; is_bot: boolean; first_name: string; username?: string; language_code?: string }
  text?: string
  caption?: string
  photo?: TelegramPhotoSize[]
}
type TelegramCallbackQuery = {
  id: string
  from: { id: number; is_bot: boolean; first_name: string; username?: string; language_code?: string }
  message?: TelegramMessage
  data?: string
}
type TelegramUpdate = {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET
const TELEGRAM_API = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null
const TELEGRAM_FILE = BOT_TOKEN ? `https://api.telegram.org/file/bot${BOT_TOKEN}` : null

const PHOTO_TTL_MS = 15 * 60 * 1000
const lastPhotoByUser = new Map<number, { fileId: string; ts: number }>()

const filmPresets = {
  gloss: { label: "Глянцевая", saturation: 1.2, brightness: 1.05, contrast: 1.08, linear: -6 },
  matte: { label: "Матовая", saturation: 0.8, brightness: 0.95, contrast: 0.95, linear: 0 },
  dark: { label: "Сатин / Dark", saturation: 0.9, brightness: 0.85, contrast: 1.2, linear: -18 },
} as const

type FilmId = keyof typeof filmPresets

function isFilmId(value: string | undefined): value is FilmId {
  return value === "gloss" || value === "matte" || value === "dark"
}

function rememberPhoto(userId: number, fileId: string) {
  lastPhotoByUser.set(userId, { fileId, ts: Date.now() })
}

function getRememberedPhoto(userId: number) {
  const record = lastPhotoByUser.get(userId)
  if (!record) return null
  if (Date.now() - record.ts > PHOTO_TTL_MS) {
    lastPhotoByUser.delete(userId)
    return null
  }
  return record.fileId
}

async function telegramJson(method: string, payload: Record<string, unknown>) {
  if (!TELEGRAM_API) throw new Error("BOT_TOKEN is missing")
  const response = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Telegram ${method} failed: ${response.status} ${text}`)
  }
  return response.json()
}

async function telegramForm(method: string, form: FormData) {
  if (!TELEGRAM_API) throw new Error("BOT_TOKEN is missing")
  const response = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    body: form,
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Telegram ${method} failed: ${response.status} ${text}`)
  }
  return response.json()
}

function buildFilmKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: filmPresets.gloss.label, callback_data: "film:gloss" },
        { text: filmPresets.matte.label, callback_data: "film:matte" },
      ],
      [{ text: filmPresets.dark.label, callback_data: "film:dark" }],
    ],
  }
}

async function sendFilmOptions(chatId: number) {
  await telegramJson("sendMessage", {
    chat_id: chatId,
    text: "Выберите тип пленки:",
    reply_markup: buildFilmKeyboard(),
  })
}

async function fetchTelegramFile(fileId: string) {
  if (!TELEGRAM_API || !TELEGRAM_FILE) throw new Error("BOT_TOKEN is missing")
  const data = await telegramJson("getFile", { file_id: fileId })
  const filePath = data?.result?.file_path as string | undefined
  if (!filePath) {
    throw new Error("Telegram getFile: file_path missing")
  }
  const response = await fetch(`${TELEGRAM_FILE}/${filePath}`)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Telegram file download failed: ${response.status} ${text}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function applyFilm(buffer: Buffer, filmId: FilmId) {
  const preset = filmPresets[filmId]
  return sharp(buffer)
    .rotate()
    .modulate({
      saturation: preset.saturation,
      brightness: preset.brightness,
    })
    .linear(preset.contrast, preset.linear)
    .jpeg({ quality: 90 })
    .toBuffer()
}

async function sendProcessedPhoto(chatId: number, caption: string, imageBuffer: Buffer) {
  const form = new FormData()
  const imageArrayBuffer = imageBuffer.buffer.slice(
    imageBuffer.byteOffset,
    imageBuffer.byteOffset + imageBuffer.byteLength
  )
  form.append("chat_id", String(chatId))
  form.append("caption", caption)
  form.append("photo", new Blob([imageArrayBuffer], { type: "image/jpeg" }), "film-preview.jpg")
  await telegramForm("sendPhoto", form)
}

export async function POST(request: Request) {
  try {
    if (WEBHOOK_SECRET) {
      const secret = request.headers.get("x-telegram-bot-api-secret-token")
      if (secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ ok: false }, { status: 401 })
      }
    }

    if (!BOT_TOKEN) {
      return NextResponse.json({ ok: false, error: "BOT_TOKEN is missing" }, { status: 500 })
    }

    const update = (await request.json()) as TelegramUpdate

    if (update.message) {
      const chatId = update.message.chat.id
      const text = update.message.text?.trim()
      const photo = update.message.photo

      if (text?.startsWith("/start")) {
        await telegramJson("sendMessage", {
          chat_id: chatId,
          text: "Пришлите фото автомобиля. Затем выберите тип пленки — я пришлю визуализацию.",
        })
        return NextResponse.json({ ok: true })
      }

      if (photo && photo.length > 0) {
        const biggestPhoto = photo[photo.length - 1]
        rememberPhoto(update.message.from?.id ?? chatId, biggestPhoto.file_id)
        await sendFilmOptions(chatId)
        return NextResponse.json({ ok: true })
      }

      await telegramJson("sendMessage", {
        chat_id: chatId,
        text: "Пришлите фото автомобиля, чтобы я сделал визуализацию пленки.",
      })
      return NextResponse.json({ ok: true })
    }

    if (update.callback_query) {
      const data = update.callback_query.data
      const filmId = data?.split(":")[1]
      const userId = update.callback_query.from.id
      const chatId = update.callback_query.message?.chat.id

      await telegramJson("answerCallbackQuery", { callback_query_id: update.callback_query.id })

      if (!chatId || !isFilmId(filmId)) {
        return NextResponse.json({ ok: true })
      }

      const fileId = getRememberedPhoto(userId)
      if (!fileId) {
        await telegramJson("sendMessage", {
          chat_id: chatId,
          text: "Фото не найдено. Пожалуйста, отправьте фото еще раз.",
        })
        return NextResponse.json({ ok: true })
      }

      const original = await fetchTelegramFile(fileId)
      const processed = await applyFilm(original, filmId)

      await sendProcessedPhoto(chatId, `Вариант пленки: ${filmPresets[filmId].label}`, processed)

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("telegram-bot-error", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
