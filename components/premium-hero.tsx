"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const APPLE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export type PremiumHeroProps = {
  id?: string
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundSrc?: string
  heroImageSrc?: string
  heroImageAlt?: string
  className?: string
}

export function PremiumHero({
  id = "hero",
  eyebrow = "PREMIUM DETAILING STUDIO",
  title = "Премиальный детейлинг автомобилей",
  subtitle = "Вернем вашему авто состояние нового",
  ctaLabel = "Записаться",
  ctaHref = "#contacts",
  backgroundSrc = "/placeholders/hero-detailing.svg",
  heroImageSrc = "/uploads/polirovka.jpg",
  heroImageAlt = "Автомобиль в детейлинге",
  className,
}: PremiumHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -72])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 36])
  const headingId = `${id}-title`
  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaHref?.startsWith("#")) return
    event.preventDefault()
    const target = document.getElementById(ctaHref.slice(1))
    if (!target) return
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    history.replaceState(null, "", ctaHref)
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn("relative min-h-screen overflow-hidden", className)}
    >
      <motion.div
        aria-hidden
        style={
          prefersReducedMotion
            ? undefined
            : {
                y: backgroundY,
                scale: backgroundScale,
              }
        }
        className="absolute inset-0 z-0"
      >
        <Image
          src={backgroundSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(140%_95%_at_50%_2%,rgba(255,255,255,0.24),rgba(255,255,255,0)_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-[#050505]" />
      </motion.div>

      <div className="site-container relative z-10 flex min-h-screen items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
          style={prefersReducedMotion ? undefined : { y: textY }}
          className="w-full"
        >
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.04, ease: APPLE_EASE }}
                className="flex justify-center md:justify-start"
              >
                <Image
                  src="/uploads/logo.svg"
                  alt="Haydetail"
                  width={360}
                  height={360}
                  priority
                  className="h-36 w-auto drop-shadow-[0_28px_60px_rgba(0,0,0,0.55)] sm:h-44 lg:h-52"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05, ease: APPLE_EASE }}
                className="mt-8 text-sm font-semibold uppercase tracking-[0.36em] text-amber-300"
              >
                {eyebrow}
              </motion.p>

              <motion.h1
                id={headingId}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.12, ease: APPLE_EASE }}
                className="mt-5 max-w-[18ch] text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.2, ease: APPLE_EASE }}
                className="mt-6 max-w-xl text-base leading-relaxed text-zinc-200 sm:text-lg"
              >
                {subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.28, ease: APPLE_EASE }}
                className="mt-10"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-amber-400 px-10 text-base font-semibold text-black shadow-[0_18px_36px_rgba(245,158,11,0.45)] transition-transform duration-300 hover:scale-[1.03] hover:bg-amber-300"
                >
                  <Link href={ctaHref} onClick={handleCtaClick}>
                    {ctaLabel}
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: APPLE_EASE }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
