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

const SITE_TITLE = "Детейлинг студия | Полировка, Керамика, Химчистка"
const SITE_DESCRIPTION = "Премиальный уход за автомобилем"

export const metadata: Metadata = {
  metadataBase: new URL("https://haydetail-am.vercel.app"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ru_RU",
    siteName: "Haydetail",
    url: "/",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Haydetail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/uploads/logo-removebg-preview.png", type: "image/png" },
    ],
    apple: "/uploads/logo-removebg-preview.png",
  },
  themeColor: "#f59e0b",
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

