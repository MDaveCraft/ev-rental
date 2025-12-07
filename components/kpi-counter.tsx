"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  from?: number
  to: number
  durationMs?: number
  suffix?: string
  decimals?: number
}

export function KpiCounter({ from = 0, to, durationMs = 1000, suffix = "", decimals = 0 }: Props) {
  const [value, setValue] = useState(from)
  const raf = useRef<number | null>(null)
  const start = useRef<number | null>(null)

  useEffect(() => {
    const step = (ts: number) => {
      if (start.current === null) start.current = ts
      const progress = Math.min(1, (ts - start.current) / durationMs)
      const next = from + (to - from) * easeOutCubic(progress)
      setValue(next)
      if (progress < 1) {
        raf.current = requestAnimationFrame(step)
      }
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [from, to, durationMs])

  return <span>{value.toFixed(decimals) + suffix}</span>
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
