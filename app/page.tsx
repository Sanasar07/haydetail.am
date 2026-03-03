"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef, useState, type FormEvent } from "react"
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
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

import { TiltCard } from "@/components/tilt-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ServiceItem = { title: string; description: string; image: string }
type WhyItem = { icon: LucideIcon; title: string; description: string; image: string }
type PortfolioItem = { title: string; description: string; beforeImage: string; afterImage: string }

const services: ServiceItem[] = [
  {
    title: "Детейлинг мойка",
    description: "Безопасная многоэтапная мойка кузова и дисков.",
    image:
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Полировка кузова",
    description: "Убираем микрориски и возвращаем глубокий блеск.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Керамическое покрытие",
    description: "Долговременная защита ЛКП и гидрофобный эффект.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Оклейка защитной пленкой",
    description: "Защита от сколов, реагентов и мелких повреждений.",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Химчистка салона",
    description: "Глубокая очистка всех материалов салона.",
    image:
      "https://images.unsplash.com/photo-1617654112328-28f6f5d6f3b9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Тонировка стекол",
    description: "Комфорт, приватность и защита салона от солнца.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  },
]

const whyItems: WhyItem[] = [
  {
    icon: Gem,
    title: "Премиум материалы",
    description: "Только проверенные бренды и сертифицированная химия.",
    image:
      "https://images.unsplash.com/photo-1605433247501-698725862cea?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Wrench,
    title: "Опытные мастера",
    description: "Точность исполнения и персональный контроль качества.",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия качества",
    description: "Фиксируем стандарты и отвечаем за конечный результат.",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Sparkles,
    title: "Современное оборудование",
    description: "Профессиональный свет и оборудование для точной работы.",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Работаем с любыми авто",
    description: "От премиальных седанов до семейных и спортивных авто.",
    image:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Sparkles,
    title: "Индивидуальный подход",
    description: "Пакет услуг под ваш стиль эксплуатации автомобиля.",
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
  },
]

const portfolioItems: PortfolioItem[] = [
  {
    title: "Глубокая полировка",
    description: "Удаление мелких дефектов и восстановление блеска.",
    beforeImage:
      "https://images.unsplash.com/photo-1549921296-3a6b5f9220bb?auto=format&fit=crop&w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Комплексный детейлинг",
    description: "Полный цикл работ по кузову и интерьеру.",
    beforeImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Защитная пленка",
    description: "Бережная оклейка сложных элементов кузова.",
    beforeImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Химчистка салона",
    description: "Глубокая очистка сидений, пластика и потолка.",
    beforeImage:
      "https://images.unsplash.com/photo-1617654112328-28f6f5d6f3b9?auto=format&fit=crop&w=1400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80",
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

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Card className="group relative aspect-square overflow-hidden rounded-2xl border-white/10 bg-black/35 p-0 shadow-lg shadow-black/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/20">
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/95 group-hover:via-black/55" />
      <div className="absolute inset-0 bg-white/0 backdrop-blur-0 transition-all duration-500 group-hover:bg-white/5 group-hover:backdrop-blur-sm" />
      <div className="relative z-10 mt-auto flex h-full flex-col justify-end p-6">
        <h3 className="text-xl font-semibold tracking-wide text-white">{item.title}</h3>
        <p className="mt-2 text-sm tracking-wide text-zinc-300">{item.description}</p>
        <Button
          variant="outline"
          className="mt-4 h-10 w-fit rounded-xl border-white/25 bg-black/35 px-4 text-white hover:border-amber-300/70 hover:bg-amber-400/15 hover:text-amber-100"
        >
          Подробнее
        </Button>
      </div>
    </Card>
  )
}

function WhyCard({ item }: { item: WhyItem }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])
  const Icon = item.icon

  return (
    <motion.div ref={ref} variants={cardVariants}>
      <TiltCard className="h-full">
        <Card className="group relative aspect-square overflow-hidden rounded-2xl border-white/10 bg-black/35 p-0 transition-all duration-500 hover:shadow-[0_0_34px_rgba(245,158,11,0.26)]">
          <motion.div style={{ y: imageY }} className="absolute inset-0 tilt-layer-back">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          <div className="absolute inset-0 rounded-2xl border border-amber-300/0 transition-colors duration-500 group-hover:border-amber-300/45" />
          <div className="relative z-10 mt-auto flex h-full flex-col justify-end p-6">
            <div className="tilt-layer-mid mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-300 backdrop-blur-sm">
              <Icon className="size-5" />
            </div>
            <h3 className="tilt-layer-front text-lg font-semibold tracking-wide text-white">{item.title}</h3>
            <p className="tilt-layer-front mt-2 text-sm tracking-wide text-zinc-300">{item.description}</p>
          </div>
        </Card>
      </TiltCard>
    </motion.div>
  )
}

function PortfolioCard({
  item,
  index,
  onOpen,
}: {
  item: PortfolioItem
  index: number
  onOpen: (index: number) => void
}) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const beforeY = useTransform(scrollYProgress, [0, 1], ["-5%", "6%"])
  const afterY = useTransform(scrollYProgress, [0, 1], ["-8%", "9%"])

  return (
    <motion.button
      ref={ref}
      type="button"
      variants={cardVariants}
      onClick={() => onOpen(index)}
      className="group relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/50"
    >
      <motion.div style={{ y: beforeY }} className="absolute inset-0">
        <Image src={item.beforeImage} alt={`До: ${item.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </motion.div>
      <motion.div
        style={{ y: afterY }}
        className="absolute inset-0 [clip-path:inset(0_56%_0_0)] transition-[clip-path] duration-500 group-hover:[clip-path:inset(0_0%_0_0)]"
      >
        <Image src={item.afterImage} alt={`После: ${item.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-100">До</div>
      <div className="absolute right-4 top-4 z-10 rounded-full border border-amber-300/35 bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">После</div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <h3 className="text-xl font-semibold tracking-wide text-white">{item.title}</h3>
        <p className="mt-2 max-w-lg text-sm tracking-wide text-zinc-300">{item.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300">
          Открыть работу
          <ArrowRight className="size-4" />
        </span>
      </div>
    </motion.button>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 90])
  const heroBackgroundScale = useTransform(heroProgress, [0, 1], [1, 1.16])
  const heroBackgroundY = useTransform(heroProgress, [0, 1], [0, -40])

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

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "idle" | "success" | "error"; text: string }>({
    type: "idle",
    text: "",
  })

  const movePortfolio = (direction: 1 | -1) => {
    setActivePortfolioIndex((prev) => {
      if (prev === null) return 0
      if (direction === 1) return (prev + 1) % portfolioItems.length
      return (prev - 1 + portfolioItems.length) % portfolioItems.length
    })
  }

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative overflow-x-clip premium-bg">
      <motion.div aria-hidden style={{ y: lightOne }} className="pointer-events-none absolute -left-24 top-28 z-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <motion.div aria-hidden style={{ y: lightTwo }} className="pointer-events-none absolute -right-28 top-[38rem] z-0 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />

      <section ref={heroRef} className="relative min-h-[88vh] overflow-hidden pt-16">
        <motion.div style={{ scale: heroBackgroundScale, y: heroBackgroundY }} className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80" alt="Premium detailing studio" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-[#0a0a0a]" />
        </motion.div>
        <div className="site-container relative z-10 flex min-h-[80vh] items-center section-space">
          <motion.div style={{ y: heroTextY }} variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl">
            <motion.p variants={cardVariants} className="section-kicker">PREMIUM DETAILING STUDIO</motion.p>
            <motion.h1 variants={cardVariants} className="mt-5 text-4xl font-bold leading-tight tracking-wide text-white md:text-6xl">
              Премиальный уход для <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">вашего авто</span> без компромиссов
            </motion.h1>
            <motion.p variants={cardVariants} className="mt-6 max-w-2xl text-lg leading-relaxed tracking-wide text-zinc-300">
              Детейлинг, полировка, керамика и защита пленкой в минималистичном luxury-стиле.
            </motion.p>
            <motion.div variants={cardVariants} className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl bg-amber-400 px-7 text-base font-semibold text-black shadow-lg shadow-amber-500/35 hover:bg-amber-300">
                <Link href="#contacts">Записаться</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/30 bg-black/30 px-7 text-base text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10">
                <Link href="#portfolio">Смотреть работы</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section id="services" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">SERVICES</p>
          <h2 className="section-title">Детейлинг услуги</h2>
          <p className="section-lead">Комплексные решения для экстерьера и интерьера с долговечным результатом.</p>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => (
              <motion.div key={item.title} variants={cardVariants}><ServiceCard item={item} /></motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="why-us" className="section-space scroll-mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="site-container">
          <p className="section-kicker">WHY CHOOSE US</p>
          <h2 className="section-title">Почему выбирают нас</h2>
          <p className="section-lead">Технологичный подход, аккуратные процессы и контроль качества на каждом этапе.</p>
          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-3">
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
            <Button asChild size="lg" className="mt-9 h-12 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-8 text-base font-semibold text-black shadow-lg shadow-amber-500/35 hover:scale-105">
              <Link href="#contacts">Оставить заявку</Link>
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
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="glass-card mt-6 overflow-hidden rounded-2xl border border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Карта проезда</p>
              <MapPin className="size-4 text-amber-300" />
            </div>
            <iframe title="Detailing studio location" src="https://www.google.com/maps?q=Yerevan%209%20May%20Street%2026&output=embed" className="h-[340px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        </div>
      </motion.section>

      <Dialog open={activePortfolioIndex !== null} onOpenChange={(open) => !open && setActivePortfolioIndex(null)}>
        <DialogContent className="max-w-5xl border-white/10 bg-[#090909]/95 p-4 backdrop-blur-xl sm:p-6">
          <DialogTitle className="sr-only">{activePortfolioItem?.title}</DialogTitle>
          <DialogDescription className="sr-only">{activePortfolioItem?.description}</DialogDescription>
          {activePortfolioItem ? (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="relative aspect-[16/9]">
                  <Image src={activePortfolioItem.afterImage} alt={activePortfolioItem.title} fill sizes="95vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-2xl font-semibold tracking-wide text-white">{activePortfolioItem.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm tracking-wide text-zinc-300">{activePortfolioItem.description}</p>
                  </div>
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
