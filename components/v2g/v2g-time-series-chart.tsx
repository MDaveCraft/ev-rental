"use client"

import { motion } from "framer-motion"

interface V2GTimeSeriesChartProps {
  variant?: "light" | "dark"
  expanded?: boolean
}

// Sample data for the chart
const monthlyData = [
  { month: "Jan", credits: 180, events: 12 },
  { month: "Feb", credits: 220, events: 15 },
  { month: "Mar", credits: 310, events: 18 },
  { month: "Apr", credits: 280, events: 16 },
  { month: "May", credits: 350, events: 21 },
  { month: "Jun", credits: 420, events: 24 },
  { month: "Jul", credits: 380, events: 22 },
  { month: "Aug", credits: 450, events: 26 },
  { month: "Sep", credits: 520, events: 29 },
  { month: "Oct", credits: 480, events: 27 },
  { month: "Nov", credits: 560, events: 31 },
  { month: "Dec", credits: 620, events: 34 },
]

export function V2GTimeSeriesChart({ variant = "light", expanded = false }: V2GTimeSeriesChartProps) {
  const maxCredits = Math.max(...monthlyData.map((d) => d.credits))
  const isDark = variant === "dark"

  if (expanded) {
    // Expanded bar chart with line overlay for dark section
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-48 gap-2">
          {monthlyData.map((data, i) => {
            const height = (data.credits / maxCredits) * 100
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm relative group cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-stone-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.credits} credits
                  </div>
                </motion.div>
                <span className="text-[10px] text-stone-500">{data.month}</span>
              </div>
            )
          })}
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-stone-800">
          {[
            { label: "Avg Monthly", value: "387", unit: "credits" },
            { label: "Peak Month", value: "620", unit: "credits" },
            { label: "Total Events", value: "275", unit: "sessions" },
            { label: "Growth", value: "+244%", unit: "YoY" },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center">
              <p className="text-2xl font-bold text-amber-500">{kpi.value}</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Compact area chart for side panel
  const pathData = monthlyData
    .map((d, i) => {
      const x = (i / (monthlyData.length - 1)) * 100
      const y = 100 - (d.credits / maxCredits) * 80
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const areaPath = `${pathData} L 100 100 L 0 100 Z`

  return (
    <div className="h-32 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Area fill */}
        <path d={areaPath} fill={isDark ? "url(#gradientDark)" : "url(#gradientLight)"} opacity={0.3} />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={isDark ? "#d97706" : "#92400e"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradientLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id="gradientDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
        </defs>
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-muted-foreground">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  )
}
