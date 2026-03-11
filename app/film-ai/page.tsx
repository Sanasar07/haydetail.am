"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

const filmStyles = [
  { id: "gloss", label: "Глянцевая", className: "contrast-110 saturate-110" },
  { id: "matte", label: "Матовая", className: "saturate-70 brightness-95" },
  { id: "dark", label: "Сатин / Dark", className: "brightness-75 contrast-125" },
] as const
const botUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? "https://t.me/haydetail_ai"

export default function FilmAiPage() {
  const [selectedFilm, setSelectedFilm] = useState<(typeof filmStyles)[number]["id"]>("gloss")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const activeStyle = useMemo(
    () => filmStyles.find((film) => film.id === selectedFilm) ?? filmStyles[0],
    [selectedFilm]
  )

  return (
    <main className="section-space bg-black">
      <div className="site-container">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center">
            <p className="section-kicker">AI Подбор Пленки</p>
            <h1 className="section-title">Скиньте фото вашей машины</h1>
            <p className="section-lead mx-auto">
              Вы узнаете, какая пленка вам подходит, и увидите предварительный вариант внешнего вида.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-sm sm:p-8">
              <label className="mb-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-amber-400/45 bg-amber-500/10 px-4 py-4 text-sm text-amber-200 transition hover:bg-amber-500/15">
                <Upload className="size-4" />
                Загрузить фото машины
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    const localUrl = URL.createObjectURL(file)
                    setImageUrl(localUrl)
                  }}
                />
              </label>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Превью с пленкой"
                    className={`h-[360px] w-full object-cover transition duration-300 ${activeStyle.className}`}
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500">
                    Загрузите фото, чтобы увидеть визуализацию
                  </div>
                )}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-sm sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Тип пленки</p>
              <div className="mt-4 space-y-3">
                {filmStyles.map((film) => (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() => setSelectedFilm(film.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selectedFilm === film.id
                        ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                        : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/30"
                    }`}
                  >
                    {film.label}
                  </button>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">
                Для точного расчета и рекомендаций отправьте фото в Telegram.
              </div>

              <Button asChild className="mt-6 w-full bg-amber-500 text-black hover:bg-amber-400">
                <a href={botUrl} target="_blank" rel="noopener noreferrer">
                  Перейти в Telegram AI
                </a>
              </Button>

              <Button asChild variant="outline" className="mt-3 w-full border-white/20 bg-white/5 text-white hover:bg-white/15">
                <Link href="/">Назад на главную</Link>
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
