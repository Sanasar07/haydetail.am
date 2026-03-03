type LeadNotificationPayload = {
  id: number
  name: string
  phone: string
  service: string
  message: string | null
  status: string
  createdAt: Date
}

export async function sendLeadTelegramNotification(payload: LeadNotificationPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return
  }

  const text = [
    "Новая заявка",
    `ID: ${payload.id}`,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.service}`,
    `Статус: ${payload.status}`,
    `Сообщение: ${payload.message || "-"}`,
    `Дата: ${payload.createdAt.toISOString()}`,
  ].join("\n")

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram sendMessage failed: ${response.status} ${errorText}`)
  }
}
