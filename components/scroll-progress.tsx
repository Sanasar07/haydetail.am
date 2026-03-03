"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.2,
  })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500"
      style={{ scaleX }}
    />
  )
}

