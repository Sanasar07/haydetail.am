"use client"

import { useState, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className, intensity = 8 }: TiltCardProps) {
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)")

  const isTiltEnabled = () => {
    if (typeof window === "undefined") return false
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    return canHover && !reducedMotion
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isTiltEnabled()) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width
    const relativeY = (event.clientY - bounds.top) / bounds.height

    const rotateY = (relativeX - 0.5) * intensity * 2
    const rotateX = (0.5 - relativeY) * intensity * 2

    setTransform(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`)
  }

  const handleMouseLeave = () => {
    if (!isTiltEnabled()) return
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)")
  }

  return (
    <div
      className={cn("h-full [perspective:1200px]", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="h-full transition-transform duration-300 [transform-style:preserve-3d] will-change-transform"
        style={{ transform }}
      >
        {children}
      </div>
    </div>
  )
}
