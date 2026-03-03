"use client"

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"

export type Lang = "ru" | "hy" | "en"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const STORAGE_KEY = "haydetail-language"
const LANGUAGE_EVENT = "haydetail-language-change"
const DEFAULT_LANG: Lang = "ru"

const LanguageContext = createContext<LanguageContextValue | null>(null)

let currentLang: Lang = DEFAULT_LANG

const isLang = (value: string | null): value is Lang => value === "ru" || value === "hy" || value === "en"

function readLanguageSnapshot(): Lang {
  return currentLang
}

function subscribeLanguage(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined
  }

  const syncFromStorage = () => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLang(saved) && saved !== currentLang) {
      currentLang = saved
      onChange()
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    if (isLang(event.newValue) && event.newValue !== currentLang) {
      currentLang = event.newValue
      onChange()
    }
  }

  const handleCustomEvent = () => syncFromStorage()

  window.addEventListener("storage", handleStorage)
  window.addEventListener(LANGUAGE_EVENT, handleCustomEvent)
  const timer = window.setTimeout(syncFromStorage, 0)

  return () => {
    window.clearTimeout(timer)
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(LANGUAGE_EVENT, handleCustomEvent)
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLanguage, readLanguageSnapshot, () => DEFAULT_LANG)

  const setLang = (nextLang: Lang) => {
    if (typeof window === "undefined") return
    currentLang = nextLang
    window.localStorage.setItem(STORAGE_KEY, nextLang)
    window.dispatchEvent(new Event(LANGUAGE_EVENT))
  }

  const value = useMemo(() => ({ lang, setLang }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }

  return context
}
