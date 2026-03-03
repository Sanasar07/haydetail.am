import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { LanguageProvider } from "@/components/language-provider"
import { FloatingBookingButton } from "@/components/floating-booking-button"
import { ScrollProgress } from "@/components/scroll-progress"
import { SiteLoader } from "@/components/site-loader"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Детейлинг студия | Полировка, Керамика, Химчистка",
  description: "Премиальный уход за автомобилем",
  openGraph: {
    title: "Детейлинг студия | Полировка, Керамика, Химчистка",
    description: "Премиальный уход за автомобилем",
    type: "website",
    locale: "ru_RU",
    siteName: "Haydetail",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
            <SiteLoader />
            <ScrollProgress />
            <SiteHeader />

            <main className="flex-1">{children}</main>
            <FloatingBookingButton />

            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}

