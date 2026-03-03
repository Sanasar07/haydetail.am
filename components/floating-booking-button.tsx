"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useLanguage, type Lang } from "@/components/language-provider"

const labels: Record<Lang, string> = {
  ru: "Записаться",
  hy: "Գրանցվել",
  en: "Book now",
}

export function FloatingBookingButton() {
  const pathname = usePathname()
  const { lang } = useLanguage()

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null
  }

  return (
    <Link
      href="/#booking"
      className="fixed bottom-6 right-5 z-50 inline-flex items-center rounded-full border border-white/20 bg-amber-500/95 px-5 py-3 text-sm font-semibold tracking-wide text-black shadow-lg shadow-amber-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-amber-400 motion-safe:animate-[soft-pulse_3.2s_ease-in-out_infinite] sm:bottom-7 sm:right-6"
    >
      {labels[lang]}
    </Link>
  )
}
