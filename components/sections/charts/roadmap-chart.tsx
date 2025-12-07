"use client"

import { useRef, useState, useEffect } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { roadmapMvp, roadmapV1, roadmapV2 } from "@/lib/data"
import { cn } from "@/lib/utils"
import { luxuriousEasing, chartContainerVariants } from "@/lib/animations"

const phases = [
  { key: "mvp", label: "MVP", data: roadmapMvp },
  { key: "v1", label: "v1", data: roadmapV1 },
  { key: "v2", label: "v2", data: roadmapV2 },
] as const

export function RoadmapChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activePhase, setActivePhase] = useState<string>("mvp")
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [animateBars, setAnimateBars] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const glowY = useTransform(scrollYProgress, [0, 1], [20, -20])

  const currentData = phases.find((p) => p.key === activePhase)?.data ?? roadmapMvp

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimateBars(true), 400)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  // Reset animation when tab changes
  useEffect(() => {
    setAnimateBars(false)
    const timer = setTimeout(() => setAnimateBars(true), 100)
    return () => clearTimeout(timer)
  }, [activePhase])

  return (
    <motion.div
      ref={ref}
      variants={chartContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: 0.1 }}
      className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-6 md:p-8 backdrop-blur-sm overflow-hidden"
    >
      <motion.div
        className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        style={{ y: glowY }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: luxuriousEasing }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Roadmap Progress</h3>
            <p className="text-sm text-zinc-400 mt-1">Development milestones across product versions</p>
          </motion.div>

          <motion.div
            className="flex items-center gap-1 p-1 rounded-full bg-zinc-800/50 border border-white/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {phases.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePhase(p.key)}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                  activePhase === p.key ? "text-white" : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {activePhase === p.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/30 rounded-full shadow-lg shadow-emerald-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: luxuriousEasing }}
            className="h-[280px] md:h-[340px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />

                <XAxis
                  dataKey="milestone"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
                  dx={-10}
                  domain={[0, 100]}
                  tickCount={5}
                />

                <Tooltip
                  cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                  contentStyle={{
                    background: "rgba(24, 24, 27, 0.95)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{ color: "#10b981", fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: "#e4e4e7", fontSize: 13 }}
                  formatter={(value: number) => [`${value}%`, "Progress"]}
                />

                <Bar
                  dataKey="progress"
                  radius={[8, 8, 0, 0]}
                  onMouseEnter={(_, index) => setHoveredBar(index)}
                  animationDuration={800}
                  animationEasing="ease-out"
                  isAnimationActive={animateBars}
                >
                  {currentData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoveredBar === index ? "url(#barGradientHover)" : "url(#barGradient)"}
                      filter={hoveredBar === index ? "url(#barGlow)" : undefined}
                      style={{
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        <motion.p
          className="text-xs text-zinc-500 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Hover over bars to see detailed progress. Switch tabs to compare versions.
        </motion.p>
      </div>
    </motion.div>
  )
}
