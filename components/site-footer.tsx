"use client"

import Link from "next/link"

import { useLanguage, type Lang } from "@/components/language-provider"

const content: Record<
  Lang,
  {
    contactsTitle: string
    contactAddress: string
    socialTitle: string
    brandTitle: string
    brandLead: string
    copyright: string
  }
> = {
  ru: {
    contactsTitle: "Контакты Армения",
    contactAddress: "Ереван, ул. 9 мая, д. 26",
    socialTitle: "Мы на связи",
    brandTitle: "Haydetail",
    brandLead: "Премиальный детейлинг с уклоном на пленки",
    copyright: "Все права защищены.",
  },
  hy: {
    contactsTitle: "Կոնտակտներ Հայաստան",
    contactAddress: "Երևան, Մայիսի 9-ի փողոց, 26",
    socialTitle: "Մենք կապի մեջ ենք",
    brandTitle: "Haydetail",
    brandLead: "Պրեմիում դետեյլինգ` թաղանթների շեշտադրմամբ",
    copyright: "Բոլոր իրավունքները պաշտպանված են:",
  },
  en: {
    contactsTitle: "Armenia Contacts",
    contactAddress: "Yerevan, 9 May Street, 26",
    socialTitle: "Stay Connected",
    brandTitle: "Haydetail",
    brandLead: "Premium detailing with a focus on protective films",
    copyright: "All rights reserved.",
  },
}

export function SiteFooter() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <footer className="premium-bg border-t border-white/10">
      <div className="site-container grid gap-10 py-14 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="mb-4 text-base font-semibold text-white">{t.contactsTitle}</p>
          <p className="text-white/70">+374 55 56 26 26</p>
          <p className="mt-1 text-white/70">{t.contactAddress}</p>
        </div>

        <div>
          <p className="mb-4 text-base font-semibold text-white">{t.socialTitle}</p>
          <div className="flex flex-col gap-2 text-white/70">
            <Link href="https://www.instagram.com/haydetail_arm" className="transition hover:text-amber-300">
              Instagram
            </Link>
            <Link href="https://wa.me/37455562626" className="transition hover:text-amber-300">
              WhatsApp
            </Link>
            <Link href="https://t.me/haydetail_arm" className="transition hover:text-amber-300">
              Telegram
            </Link>
          </div>
        </div>

        <div className="md:text-right">
          <p className="mb-4 text-base font-semibold text-white">{t.brandTitle}</p>
          <p className="text-white/70">{t.brandLead}</p>
          <p className="mt-4 text-white/50">
            © {new Date().getFullYear()} {t.brandTitle}. {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

