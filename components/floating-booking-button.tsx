"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { useLanguage, type Lang } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type BookingFormData = {
  name: string
  phone: string
  message: string
}

const labels: Record<
  Lang,
  {
    trigger: string
    aria: string
    title: string
    subtitle: string
    namePlaceholder: string
    phonePlaceholder: string
    messagePlaceholder: string
    submit: string
    submitting: string
    success: string
    error: string
  }
> = {
  ru: {
    trigger: "Записаться",
    aria: "Открыть модальное окно записи",
    title: "Быстрая запись",
    subtitle: "Оставьте контакты и мы свяжемся с вами в ближайшее время",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "+374 00 000 000",
    messagePlaceholder: "Комментарий к заявке",
    submit: "Отправить заявку",
    submitting: "Отправляем...",
    success: "Заявка отправлена",
    error: "Не удалось отправить заявку. Попробуйте еще раз.",
  },
  hy: {
    trigger: "Գրվել",
    aria: "Բացել գրանցման պատուհանը",
    title: "Արագ գրանցում",
    subtitle: "Թողեք տվյալները, և մենք շուտով կկապվենք ձեզ հետ",
    namePlaceholder: "Ձեր անունը",
    phonePlaceholder: "+374 00 000 000",
    messagePlaceholder: "Մեկնաբանություն հայտին",
    submit: "Ուղարկել հայտը",
    submitting: "Ուղարկվում է...",
    success: "Հայտը ուղարկված է",
    error: "Չհաջողվեց ուղարկել հայտը։ Փորձեք նորից։",
  },
  en: {
    trigger: "Book now",
    aria: "Open booking modal",
    title: "Quick booking",
    subtitle: "Leave your contacts and we will get back to you shortly",
    namePlaceholder: "Your name",
    phonePlaceholder: "+374 00 000 000",
    messagePlaceholder: "Comment for your request",
    submit: "Send request",
    submitting: "Sending...",
    success: "Request sent",
    error: "Failed to send request. Please try again.",
  },
}

export function FloatingBookingButton() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = labels[lang]

  const [isMounted, setIsMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "idle" | "success" | "error"; text: string }>({
    type: "idle",
    text: "",
  })
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null
  }

  if (!isMounted) {
    return null
  }

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback({ type: "idle", text: "" })

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          service: "floating-booking-button",
        }),
      })

      if (!response.ok) {
        throw new Error("request failed")
      }

      setFormData({ name: "", phone: "", message: "" })
      setFeedback({ type: "success", text: t.success })
      setTimeout(() => setOpen(false), 600)
    } catch {
      setFeedback({ type: "error", text: t.error })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="fixed bottom-6 right-5 z-50 sm:bottom-7 sm:right-6"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 8.8,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            size="lg"
            aria-label={t.aria}
            className="h-12 rounded-full border border-white/20 bg-amber-500/95 px-5 text-sm font-semibold tracking-wide text-black shadow-lg shadow-amber-500/30 backdrop-blur-sm transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_26px_rgba(245,158,11,0.58)] focus-visible:ring-amber-300"
          >
            {t.trigger}
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-md border-white/15 bg-[#090909]/95 p-6 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">{t.title}</DialogTitle>
          <DialogDescription className="text-zinc-300">{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submitBooking} className="mt-4 space-y-4">
          <Input
            required
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder={t.namePlaceholder}
            className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500"
          />

          <Input
            required
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder={t.phonePlaceholder}
            className="h-11 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500"
          />

          <Textarea
            value={formData.message}
            onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
            placeholder={t.messagePlaceholder}
            className="min-h-24 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500"
          />

          {feedback.type !== "idle" ? (
            <p className={`text-sm ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {feedback.text}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-amber-500 text-black hover:bg-amber-400"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {t.submitting}
              </span>
            ) : (
              t.submit
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

