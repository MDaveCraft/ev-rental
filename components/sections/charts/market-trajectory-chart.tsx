"use client"

import { useRef, useState, useEffect } from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { marketTrajectory } from "@/lib/data"
import { luxuriousEasing, chartContainerVariants } from "@/lib/animations"

export function MarketTrajectoryChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [animateChart, setAnimateChart] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const glowY = useTransform(scrollYProgress, [0, 1], [-20, 20])

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimateChart(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <motion.div
      ref={ref}
      variants={chartContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-6 md:p-8 backdrop-blur-sm overflow-hidden"
    >
      <motion.div
        className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        style={{ y: glowY }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: luxuriousEasing }}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">EV Rental Market Trajectory</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Projected growth in fleet volume and partner network through 2030
          </p>
        </motion.div>

        <motion.div
          className="h-[320px] md:h-[380px]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketTrajectory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={animateChart ? 0.4 : 0} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="partnersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={animateChart ? 0.3 : 0} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />

              <XAxis
                dataKey="year"
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
                tickCount={5}
              />

              <Tooltip
                cursor={{ stroke: "#10b981", strokeOpacity: 0.2, strokeWidth: 1 }}
                contentStyle={{
                  background: "rgba(24, 24, 27, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                  padding: "12px 16px",
                }}
                labelStyle={{ color: "#10b981", fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: "#e4e4e7", fontSize: 13 }}
              />

              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={animateChart ? 2.5 : 0}
                fill="url(#volumeGradient)"
                filter="url(#glow)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#000",
                  strokeWidth: 2,
                }}
                isAnimationActive={animateChart}
                animationDuration={1500}
                animationEasing="ease-out"
              />

              <Area
                type="monotone"
                dataKey="partners"
                stroke="#14b8a6"
                strokeWidth={animateChart ? 2 : 0}
                fill="url(#partnersGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#14b8a6",
                  stroke: "#000",
                  strokeWidth: 2,
                }}
                isAnimationActive={animateChart}
                animationDuration={1500}
                animationEasing="ease-out"
                animationBegin={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="flex items-center gap-6 mt-4 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <span className="text-zinc-400">Fleet Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50" />
            <span className="text-zinc-400">Partners</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
