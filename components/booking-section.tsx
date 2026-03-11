"use client"

import { useState, type FormEvent } from "react"
import { CarFront, Loader2, MessageCircle, Send, ShieldCheck } from "lucide-react"

import { useLanguage, type Lang } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type BookingFormData = {
  name: string
  phone: string
  service: string
  message: string
}

const initialFormData: BookingFormData = {
  name: "",
  phone: "",
  service: "",
  message: "",
}

const copy: Record<
  Lang,
  {
    title: string
    subtitle: string
    namePlaceholder: string
    servicePlaceholder: string
    messagePlaceholder: string
    submit: string
    submitting: string
    success: string
    error: string
    consent: string
    dataProcessing: string
    services: Array<{ value: string; label: string }>
  }
> = {
  ru: {
    title: "Оставьте заявку",
    subtitle: "Ответим в течение 10 минут",
    namePlaceholder: "Ваше имя",
    servicePlaceholder: "Выберите услугу",
    messagePlaceholder: "Комментарий к заявке",
    submit: "Отправить заявку",
    submitting: "Отправляем...",
    success: "Заявка отправлена",
    error: "Ошибка отправки. Попробуйте еще раз.",
    consent: "Оставляя заявку, вы соглашаетесь на",
    dataProcessing: "обработку персональных данных",
    services: [
      { value: "ppf", label: "Оклейка PPF пленкой" },
      { value: "tint", label: "Тонировка и антихром" },
      { value: "ceramic", label: "Керамическое покрытие" },
      { value: "polish", label: "Полировка кузова" },
      { value: "cleaning", label: "Химчистка салона" },
    ],
  },
  hy: {
    title: "Թողեք հայտ",
    subtitle: "Պատասխանում ենք 10 րոպեի ընթացքում",
    namePlaceholder: "Ձեր անունը",
    servicePlaceholder: "Ընտրեք ծառայությունը",
    messagePlaceholder: "Մեկնաբանություն հայտին",
    submit: "Ուղարկել հայտը",
    submitting: "Ուղարկվում է...",
    success: "Հայտը ուղարկված է",
    error: "Ուղարկման սխալ։ Փորձեք նորից։",
    consent: "Հայտ թողնելով՝ դուք համաձայնվում եք",
    dataProcessing: "անձնական տվյալների մշակմանը",
    services: [
      { value: "ppf", label: "PPF թաղանթով պատում" },
      { value: "tint", label: "Տոնավորում և անտիքրոմ" },
      { value: "ceramic", label: "Կերամիկական ծածկույթ" },
      { value: "polish", label: "Թափքի փայլեցում" },
      { value: "cleaning", label: "Սրահի քիմմաքրում" },
    ],
  },
  en: {
    title: "Leave a request",
    subtitle: "We reply within 10 minutes",
    namePlaceholder: "Your name",
    servicePlaceholder: "Choose service",
    messagePlaceholder: "Comment for your request",
    submit: "Send request",
    submitting: "Sending...",
    success: "Request sent",
    error: "Send failed. Please try again.",
    consent: "By submitting, you agree to",
    dataProcessing: "personal data processing",
    services: [
      { value: "ppf", label: "PPF film wrapping" },
      { value: "tint", label: "Tinting and dechrome" },
      { value: "ceramic", label: "Ceramic coating" },
      { value: "polish", label: "Body polishing" },
      { value: "cleaning", label: "Interior detailing" },
    ],
  },
}

export function BookingSection() {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { lang } = useLanguage()
  const t = copy[lang]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || t.error)
      }

      setSuccess(t.success)
      setFormData(initialFormData)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="booking" className="section-space premium-bg scroll-mt-24">
      <div className="site-container">
        <div className="glass-panel mx-auto max-w-2xl rounded-2xl p-7 shadow-xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <CarFront className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Detail Studio</p>
              <p className="text-sm font-medium text-white">Haydetail</p>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl">{t.title}</h2>
            <p className="mt-3 text-base tracking-wide text-zinc-400 sm:text-lg lg:text-xl">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              required
              name="name"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              className="h-14 rounded-xl border-white/20 bg-white/90 px-5 text-base text-zinc-900 shadow-lg shadow-black/20 placeholder:text-zinc-500"
            />

            <div className="flex h-14 items-center gap-3 rounded-xl border border-white/20 bg-white/90 px-4 shadow-lg shadow-black/20">
              <span className="text-sm text-zinc-600">AM</span>
              <span className="text-zinc-500">?</span>
              <Input
                required
                name="phone"
                type="tel"
                placeholder="+374 00-000-000"
                value={formData.phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                className="h-full border-0 bg-transparent px-0 text-base text-zinc-900 placeholder:text-zinc-500 focus-visible:ring-0"
              />
            </div>

            <Select value={formData.service} onValueChange={(service) => setFormData((prev) => ({ ...prev, service }))}>
              <SelectTrigger className="h-14 rounded-xl border-white/20 bg-white/90 px-5 text-base text-zinc-700 shadow-lg shadow-black/20 data-[placeholder]:text-zinc-500">
                <SelectValue placeholder={t.servicePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {t.services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              required
              name="message"
              placeholder={t.messagePlaceholder}
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              className="min-h-28 rounded-xl border-white/20 bg-white/90 px-5 py-4 text-base text-zinc-900 shadow-lg shadow-black/20 placeholder:text-zinc-500"
            />

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="h-14 w-full rounded-xl bg-amber-500 text-lg font-medium text-black shadow-xl shadow-amber-500/20 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  {t.submitting}
                </span>
              ) : (
                t.submit
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-400">
            {t.consent} <span className="text-amber-400">{t.dataProcessing}</span>
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="https://wa.me/37455562626"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-zinc-200 transition hover:border-amber-400/50"
            >
              <MessageCircle className="size-4 text-amber-400" />
              WhatsApp
            </a>
            <a
              href="/film-ai"
              className="glass-card flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-zinc-200 transition hover:border-amber-400/50"
            >
              <Send className="size-4 text-amber-400" />
              Telegram
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <ShieldCheck className="size-4 text-zinc-500" />
            <span className="glass-card rounded-full px-4 py-1 text-sm text-zinc-300">haydetail.ru</span>
          </div>
        </div>
      </div>
    </section>
  )
}

