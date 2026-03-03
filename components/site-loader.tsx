"use client"

import { useEffect, useState } from "react"

export function SiteLoader() {
  const [phase, setPhase] = useState<"visible" | "hiding" | "hidden">("visible")

  useEffect(() => {
    let startHideTimer: ReturnType<typeof setTimeout> | undefined
    let removeTimer: ReturnType<typeof setTimeout> | undefined

    const startHide = () => {
      setPhase("hiding")
      removeTimer = setTimeout(() => setPhase("hidden"), 450)
    }

    if (document.readyState === "complete") {
      startHideTimer = setTimeout(startHide, 220)
    } else {
      window.addEventListener("load", startHide, { once: true })
    }

    return () => {
      if (startHideTimer) clearTimeout(startHideTimer)
      if (removeTimer) clearTimeout(removeTimer)
      window.removeEventListener("load", startHide)
    }
  }, [])

  if (phase === "hidden") return null

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ${
        phase === "hiding" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
        <span className="size-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <span className="text-sm font-medium tracking-wide text-zinc-200">Haydetail</span>
      </div>
    </div>
  )
}

