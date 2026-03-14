"use client"

import Image from "next/image"
import { memo, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gem,
  MapPin,
  Phone,
  SendHorizonal,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

import { PremiumHero } from "@/components/premium-hero"
import { TiltCard } from "@/components/tilt-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ServiceItem = { title: string; description: string; details: string[]; image: string; icon: LucideIcon }
type WhyItem = { title: string; description: string; image: string }
type PortfolioItem = { title: string; description: string; beforeImage: string; afterImage: string }

const WHY_CHOOSE_COPY = {
  heading: "Почему выбирают нас?",
  lead: "Доверяя нам свой автомобиль — он будет выглядеть лучше, чем новый!",
  items: [
    {
      title: "Премиальные материалы\nи технологии",
      description:
        "Мы используем только проверенные премиальные составы и современное оборудование, чтобы обеспечить вашему автомобилю безупречный внешний вид и защиту на долгие годы",
    },
    {
      title: "Опытные мастера с\nмноголетним стажем",
      description:
        "Наши специалисты – профессионалы своего дела с богатым опытом работы в детейлинге. Они знают, как добиться идеального результата и подчеркнуть эксклюзивность вашего авто",
    },
    {
      title: "Гарантия качества\nна все виды работ",
      description:
        "Мы уверены в качестве своих услуг, поэтому предоставляем гарантию на все выполненные работы. Ваш автомобиль – в надежных руках",
    },
    {
      title: "Индивидуальный подход\nк каждому клиенту",
      description:
        "Мы подбираем решения с учетом ваших пожеланий и особенностей автомобиля, чтобы вы получили именно тот результат, который ожидаете",
    },
  ] satisfies Array<Omit<WhyItem, "image">>,
}

const services: ServiceItem[] = [
  {
    title: "Полировка и защита кузова",
    description: "Абразивная и восстановительная полировка, керамика и нанопокрытия для долговечной защиты.",
    details: [
      "Абразивная и восстановительная полировка",
      "Керамическое покрытие для защиты от грязи, воды и ультрафиолета",
      "Жидкое стекло и нанопокрытия",
    ],
    image: "/uploads/polirovka.jpg",
    icon: Sparkles,
  },
  {
    title: "Чистка и восстановление интерьера",
    description: "Глубокая химчистка и деликатное восстановление материалов салона.",
    details: [
      "Глубокая химчистка салона",
      "Восстановление и защита кожаных поверхностей",
      "Антибактериальная обработка",
    ],
    image: "/uploads/chistka.jpg",
    icon: Gem,
  },
  {
    title: "Оклейка защитными пленками",
    description: "Бронирование, тонировка и полная смена цвета авто с премиальной подгонкой.",
    details: [
      "Бронирование кузова антигравийной пленкой",
      "Тонировка стекол с соблюдением ГОСТ",
      "Полная смена цвета авто виниловыми пленками",
    ],
    image: "/uploads/plenka.jpg",
    icon: ShieldCheck,
  },
  {
    title: "Уход за оптикой и стеклами",
    description: "Восстановление прозрачности и гидрофобная защита для безопасной езды.",
    details: [
      "Полировка фар для восстановления прозрачности",
      "Антидождь и антигрязь для стекол",
    ],
    image: "/uploads/fari.jpg",
    icon: Wrench,
  },
]

const whyItems: WhyItem[] = WHY_CHOOSE_COPY.items.map((item, index) => ({
  ...item,
  image: `/placeholders/why/why-${index + 1}.svg`,
}))

const portfolioItems: PortfolioItem[] = [
  {
    title: "Глубокая полировка",
    description: "Удаление мелких дефектов и восстановление блеска.",
    beforeImage:
      "/uploads/polirovka.jpg",
    afterImage:
      "/uploads/plenka.jpg",
  },
  {
    title: "Комплексный детейлинг",
    description: "Полный цикл работ по кузову и интерьеру.",
    beforeImage:
      "/uploads/chistka.jpg",
    afterImage:
      "/uploads/polirovka.jpg",
  },
  {
    title: "Защитная пленка",
    description: "Бережная оклейка сложных элементов кузова.",
    beforeImage:
      "/uploads/fari.jpg",
    afterImage:
      "/uploads/plenka.jpg",
  },
  {
    title: "Химчистка салона",
    description: "Глубокая очистка сидений, пластика и потолка.",
    beforeImage:
      "/uploads/chistka.jpg",
    afterImage:
      "/uploads/fari.jpg",
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
}

const ServiceCard = memo(function ServiceCard({
  item,
  index,
  onOpen,
}: {
  item: ServiceItem
  index: number
  onOpen: (index: number) => void
}) {
  const Icon = item.icon

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full w-full text-left"
    >
      <TiltCard className="h-full" intensity={7}>
        <Card className="group relative aspect-square overflow-hidden rounded-2xl border-white/10 bg-black/35 p-0 shadow-lg shadow-black/40 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/20">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />
          <div className="absolute inset-0 bg-white/0 backdrop-blur-0 transition-all duration-500 group-hover:bg-white/5 group-hover:backdrop-blur-sm" />
          <div className="relative z-10 mt-auto flex h-full flex-col justify-end p-6">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-white/20 bg-black/45 text-amber-300 backdrop-blur-sm">
              <Icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold tracking-wide text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed tracking-wide text-zinc-200">{item.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300">
              Подробнее
              <ArrowRight className="size-4" />
            </span>
          </div>
        </Card>
      </TiltCard>
    </motion.button>
  )
})

const WhyCard = memo(function WhyCard({ item }: { item: WhyItem }) {
  return (
    <motion.div variants={cardVariants} whileHover={{ y: -8, scale: 1.015 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      <TiltCard className="h-full" intensity={8}>
        <Card className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-0 shadow-lg shadow-black/35 transition-all duration-500 hover:border-amber-300/45 hover:shadow-[0_0_34px_rgba(245,158,11,0.28)]">
          <div className="absolute inset-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1.5px]"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/52 to-black/20 transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 mt-auto flex h-full flex-col justify-end p-6">
            <h3 className="text-lg font-bold leading-tight tracking-wide whitespace-pre-line text-white">{item.title}</h3>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed tracking-wide text-zinc-200">{item.description}</p>
          </div>
        </Card>
      </TiltCard>
    </motion.div>
  )
})

const BeforeAfterSlider = memo(function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  aspectClassName = "aspect-[16/11]",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  beforeImage: string
  afterImage: string
  title: string
  aspectClassName?: string
  sizes?: string
}) {
  const [value, setValue] = useState(52)

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 ${aspectClassName}`}
      aria-label={`До и после: ${title}`}
    >
      <Image src={beforeImage} alt={`До: ${title}`} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={afterImage} alt={`После: ${title}`} fill sizes={sizes} className="object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-100">
        До
      </div>
      <div className="absolute right-4 top-4 z-10 rounded-full border border-amber-300/35 bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">
        После
      </div>

      <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${value}%` }}>
        <div className="absolute -translate-x-1/2 top-0 h-full w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
        <div className="absolute -translate-x-1/2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/70 backdrop-blur">
          <div className="h-4 w-px bg-white/70" />
        </div>
      </div>

      <input
        aria-label="Слайдер до/после"
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
})

const PortfolioCard = memo(function PortfolioCard({
  item,
  index,
  onOpen,
}: {
  item: PortfolioItem
  index: number
  onOpen: (index: number) => void
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/50"
    >
      <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} title={item.title} />
      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <h3 className="text-xl font-semibold tracking-wide text-white">{item.title}</h3>
        <p className="mt-2 max-w-lg text-sm tracking-wide text-zinc-300">{item.description}</p>
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
        >
          Открыть работу
          <ArrowRight className="size-4" />
        </button>
      </div>
    </motion.div>
  )
})

const ContactBookingForm = memo(function ContactBookingForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "idle" | "success" | "error"; text: string }>({
    type: "idle",
    text: "",
  })

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback({ type: "idle", text: "" })
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          service: "consultation",
        }),
      })
      if (!response.ok) throw new Error("request failed")
      setName("")
      setPhone("")
      setMessage("")
      setFeedback({ type: "success", text: "Спасибо, заявка отправлена." })
    } catch {
      setFeedback({ type: "error", text: "Не удалось отправить форму. Попробуйте еще раз." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form onSubmit={submitForm} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="glass-panel rounded-2xl border border-white/15 p-7">
      <div className="space-y-4">
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="h-12 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-amber-300/70 focus-visible:ring-4 focus-visible:ring-amber-400/25" />
        <Input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+374 00 000 000" className="h-12 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-amber-300/70 focus-visible:ring-4 focus-visible:ring-amber-400/25" />
        <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ваш комментарий" className="min-h-36 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-amber-300/70 focus-visible:ring-4 focus-visible:ring-amber-400/25" />
      </div>
      {feedback.type !== "idle" ? (
        <p className={`mt-4 text-sm ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>{feedback.text}</p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 text-base font-semibold text-black shadow-lg shadow-amber-500/35 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40">
        <span className="inline-flex items-center gap-2">{isSubmitting ? "Отправка..." : "Отправить"} <SendHorizonal className="size-4" /></span>
      </Button>
    </motion.form>
  )
})

function LazyMapEmbed() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || shouldLoad) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: "260px" },
    )

    observer.observe(mapContainerRef.current)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={mapContainerRef} className="h-[340px] w-full">
      {shouldLoad ? (
        <iframe
          title="Detailing studio location"
          src="https://yandex.ru/map-widget/v1/?text=%D0%90%D1%80%D0%BC%D0%B5%D0%BD%D0%B8%D1%8F%2C%20%D0%95%D1%80%D0%B5%D0%B2%D0%B0%D0%BD%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%209%20%D0%BC%D0%B0%D1%8F%2C%2026&ll=44.5136%2C40.1811&z=17&mode=search&l=map"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white/5 text-sm text-zinc-400">Загрузка карты...</div>
      )}
    </div>
  )
}

export default function Home() {
  const { scrollY } = useScroll()
  const lightOneY = useTransform(scrollY, [0, 1600], [0, 220])
  const lightTwoY = useTransform(scrollY, [0, 1600], [0, -180])
  const lightOne = useSpring(lightOneY, { stiffness: 90, damping: 25, mass: 0.25 })
  const lightTwo = useSpring(lightTwoY, { stiffness: 90, damping: 25, mass: 0.25 })

  const [activePortfolioIndex, setActivePortfolioIndex] = useState<number | null>(null)
  const activePortfolioItem = useMemo(
    () => (activePortfolioIndex === null ? null : portfolioItems[activePortfolioIndex]),
    [activePortfolioIndex],
  )
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null)
  const activeServiceItem = useMemo(
    () => (activeServiceIndex === null ? null : services[activeServiceIndex]),
    [activeServiceIndex],
  )

  const prefersReducedMotion = useReducedMotion()

  const movePortfolio = useCallback((direction: 1 | -1) => {
    setActivePortfolioIndex((prev) => {
      if (prev === null) return 0
      if (direction === 1) return (prev + 1) % portfolioItems.length
      return (prev - 1 + portfolioItems.length) % portfolioItems.length
    })
  }, [])
  const scrollToContacts = useCallback(() => {
    const target = document.getElementById("contacts")
    if (!target) return
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    history.replaceState(null, "", "#contacts")
  }, [prefersReducedMotion])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative overflow-x-clip premium-bg">
      <motion.div aria-hidden style={prefersReducedMotion ? undefined : { y: lightOne }} className="pointer-events-none absolute -left-24 top-28 z-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <motion.div aria-hidden style={prefersReducedMotion ? undefined : { y: lightTwo }} className="pointer-events-none absolute -right-28 top-[38rem] z-0 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />
      <PremiumHero className="pt-16" />

      <motion.section id="services" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">SERVICES</p>
          <h2 className="section-title">Услуги детейлинга</h2>
          <p className="section-lead">Полировка, интерьер, защитные пленки и уход за оптикой. Нажмите на карточку, чтобы открыть полный состав работ.</p>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item, index) => (
              <motion.div key={item.title} variants={cardVariants}><ServiceCard item={item} index={index} onOpen={setActiveServiceIndex} /></motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="why-us" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">WHY CHOOSE US</p>
          <h2 className="section-title">{WHY_CHOOSE_COPY.heading}</h2>
          <p className="section-lead">{WHY_CHOOSE_COPY.lead}</p>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {whyItems.map((item) => <WhyCard key={item.title} item={item} />)}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="portfolio" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">PORTFOLIO</p>
          <h2 className="section-title">Работы до / после</h2>
          <p className="section-lead">Нажмите на карточку, чтобы открыть изображение в полном размере.</p>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-2">
            {portfolioItems.map((item, index) => (
              <PortfolioCard key={item.title} item={item} index={index} onOpen={setActivePortfolioIndex} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="booking" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 24, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/15 px-6 py-16 text-center shadow-xl shadow-black/40 sm:px-12">
            <div className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
            <p className="section-kicker">BOOKING</p>
            <h2 className="mt-4 text-4xl font-bold tracking-wide text-white md:text-5xl">Готовы обновить ваш автомобиль?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg tracking-wide text-zinc-300">Запишитесь сейчас и получите персональную консультацию по вашему проекту.</p>
            <Button
              type="button"
              size="lg"
              onClick={scrollToContacts}
              className="mt-9 h-12 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-8 text-base font-semibold text-black shadow-lg shadow-amber-500/35 hover:scale-105"
            >
              Оставить заявку
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section id="contacts" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">CONTACTS</p>
          <h2 className="section-title">Свяжитесь с нами</h2>
          <p className="section-lead">Ответим быстро, подберем удобное время и оптимальный пакет услуг.</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="glass-card rounded-2xl border border-white/15 p-7">
              <div className="space-y-5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Телефон</p>
                  <a href="tel:+37455562626" className="mt-2 inline-flex items-center gap-2 text-lg font-semibold tracking-wide text-white hover:text-amber-300"><Phone className="size-4 text-amber-300" /> +374 55 56 26 26</a>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Адрес</p>
                  <p className="mt-2 inline-flex items-start gap-2 text-base tracking-wide text-zinc-200"><MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" /> Yerevan, 9 May Street, 26</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Время работы</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-base tracking-wide text-zinc-200"><Clock3 className="size-4 text-amber-300" /> Mon-Sun: 10:00 - 22:00</p>
                </div>
              </div>
            </motion.div>

            <ContactBookingForm />
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="glass-card mt-6 overflow-hidden rounded-2xl border border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Карта проезда</p>
              <MapPin className="size-4 text-amber-300" />
            </div>
            <LazyMapEmbed />
          </motion.div>
        </div>
      </motion.section>

      <Dialog open={activeServiceIndex !== null} onOpenChange={(open) => !open && setActiveServiceIndex(null)}>
        <DialogContent className="max-w-2xl border-white/10 bg-[#090909]/95 p-4 backdrop-blur-xl sm:p-6">
          <DialogTitle className="text-xl font-semibold tracking-wide text-white">{activeServiceItem?.title}</DialogTitle>
          <DialogDescription className="text-zinc-300">{activeServiceItem?.description}</DialogDescription>
          {activeServiceItem ? (
            <div className="space-y-5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <Image src={activeServiceItem.image} alt={activeServiceItem.title} fill sizes="95vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <ul className="space-y-2">
                {activeServiceItem.details.map((detail) => (
                  <li key={detail} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={activePortfolioIndex !== null} onOpenChange={(open) => !open && setActivePortfolioIndex(null)}>
        <DialogContent className="max-w-5xl border-white/10 bg-[#090909]/95 p-4 backdrop-blur-xl sm:p-6">
          <DialogTitle className="sr-only">{activePortfolioItem?.title}</DialogTitle>
          <DialogDescription className="sr-only">{activePortfolioItem?.description}</DialogDescription>
          {activePortfolioItem ? (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <BeforeAfterSlider
                  beforeImage={activePortfolioItem.beforeImage}
                  afterImage={activePortfolioItem.afterImage}
                  title={activePortfolioItem.title}
                  aspectClassName="aspect-[16/9]"
                  sizes="95vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-2xl font-semibold tracking-wide text-white">{activePortfolioItem.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm tracking-wide text-zinc-300">{activePortfolioItem.description}</p>
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => movePortfolio(-1)} className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"><ChevronLeft className="size-4" /></Button>
                <Button type="button" variant="outline" onClick={() => movePortfolio(1)} className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"><ChevronRight className="size-4" /></Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
