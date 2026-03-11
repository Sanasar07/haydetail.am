"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Menu, X } from "lucide-react"

import { useLanguage, type Lang } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

const navLabels: Record<Lang, { services: string; whyUs: string; booking: string; contacts: string; bot: string; cta: string; close: string; open: string }> = {
  ru: {
    services: "Услуги",
    whyUs: "Почему мы",
    booking: "Заявка",
    contacts: "Контакты",
    bot: "Бот",
    cta: "Записаться",
    close: "Закрыть меню",
    open: "Открыть меню",
  },
  hy: {
    services: "Ծառայություններ",
    whyUs: "Ինչու մենք",
    booking: "Հայտ",
    contacts: "Կոնտակտներ",
    bot: "Բոտ",
    cta: "Գրանցվել",
    close: "Փակել մենյուն",
    open: "Բացել մենյուն",
  },
  en: {
    services: "Services",
    whyUs: "Why us",
    booking: "Booking",
    contacts: "Contacts",
    bot: "Bot",
    cta: "Book now",
    close: "Close menu",
    open: "Open menu",
  },
}

const languages: Array<{ key: Lang; label: string }> = [
  { key: "ru", label: "RU" },
  { key: "hy", label: "ARM" },
  { key: "en", label: "EN" },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("#services")
  const { lang, setLang } = useLanguage()
  const scrollToHash = useCallback((href: string) => {
    if (!href.startsWith("#")) return false
    const target = document.getElementById(href.slice(1))
    if (!target) return false
    target.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", href)
    return true
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const closeMenuOnResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }

    window.addEventListener("resize", closeMenuOnResize)
    return () => window.removeEventListener("resize", closeMenuOnResize)
  }, [isOpen])

  const headerClass = isScrolled
    ? "border-white/25 bg-black/55 backdrop-blur-2xl shadow-lg shadow-black/30"
    : "border-transparent bg-transparent backdrop-blur-0"

  const t = navLabels[lang]

  const navLinks = useMemo(
    () => [
      { href: "#services", label: t.services },
      { href: "#why-us", label: t.whyUs },
      { href: "#booking", label: t.booking },
      { href: "#contacts", label: t.contacts },
    ],
    [t.booking, t.contacts, t.services, t.whyUs],
  )

  useEffect(() => {
    const syncFromHash = () => {
      const currentHash = window.location.hash
      if (navLinks.some((link) => link.href === currentHash)) {
        setActiveHref(currentHash)
      }
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)

    const sections = navLinks
      .map((link) => document.getElementById(link.href.replace("#", "")))
      .filter((section): section is HTMLElement => section !== null)

    if (!sections.length) {
      return () => window.removeEventListener("hashchange", syncFromHash)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (!visible.length) return
        setActiveHref(`#${visible[0].target.id}`)
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-25% 0px -55% 0px" },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", syncFromHash)
    }
  }, [navLinks])

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${headerClass}`}>
      <div className="site-container">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
              <Image
                src="/uploads/logo.jpg"
                alt="Haydetail"
                width={56}
                height={56}
                className="rounded-md object-cover"
              />
            <span className="text-xl font-semibold tracking-[0.04em]">Haydetail</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    if (scrollToHash(link.href)) {
                      event.preventDefault()
                      setActiveHref(link.href)
                    }
                  }}
                  className={`relative pb-1 tracking-wide transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-amber-400 after:transition-transform after:duration-300 ${
                    activeHref === link.href
                      ? "text-white after:scale-x-100"
                      : "text-white/80 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/film-ai" className="text-amber-400 transition hover:text-amber-300">
                {t.bot}
              </Link>
            </nav>

            <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-white/[0.06] p-1 backdrop-blur-md">
              {languages.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLang(item.key)}
                  className={`rounded px-2 py-1 text-xs transition ${
                    lang === item.key ? "bg-amber-500 text-black" : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Button asChild className="rounded-xl bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400">
              <Link
                href="#contacts"
                onClick={(event) => {
                  if (scrollToHash("#contacts")) {
                    event.preventDefault()
                    setActiveHref("#contacts")
                  }
                }}
              >
                {t.cta}
              </Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? t.close : t.open}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] text-white backdrop-blur-md transition hover:bg-white/10 md:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-300 md:hidden ${
            isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <nav className="glass-panel mt-1 flex flex-col gap-2 rounded-2xl p-3 text-sm font-medium text-white/85">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (scrollToHash(link.href)) {
                      setActiveHref(link.href)
                    }
                    setIsOpen(false)
                  }}
                  className={`rounded-md px-3 py-2 transition ${
                    activeHref === link.href
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/film-ai"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-amber-400 transition hover:bg-white/10"
              >
                {t.bot}
              </Link>
              <div className="mt-1 flex items-center gap-1 rounded-xl border border-white/20 bg-white/[0.06] p-1">
                {languages.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLang(item.key)}
                    className={`rounded px-2 py-1 text-xs transition ${
                      lang === item.key ? "bg-amber-500 text-black" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <Button asChild className="mt-2 rounded-xl bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400">
                <Link
                  href="#contacts"
                  onClick={(event) => {
                    if (scrollToHash("#contacts")) {
                      event.preventDefault()
                      setActiveHref("#contacts")
                    }
                    setIsOpen(false)
                  }}
                >
                  {t.cta}
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}


