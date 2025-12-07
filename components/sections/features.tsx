"use client"

import { motion, useInView } from "framer-motion"
import { BatteryCharging, CreditCard, BrainCircuit, Network, Zap, TrendingUp, BarChart3 } from "lucide-react"
import { useRef } from "react"
import {
  luxuriousEasing,
  smoothEasing,
  gridCascadeVariants,
  gridItemVariants,
  sectionHeaderVariants,
  defaultViewportMargin,
} from "@/lib/animations"

const features = [
  {
    id: "range",
    title: "AI Range & Health Assurance",
    content: "Predictive models fuse SOC, temperature, route, and driving patterns to deliver confidence bands.",
    icon: BatteryCharging,
    size: "large",
    accent: true,
  },
  {
    id: "charging",
    title: "Integrated Charging & Billing",
    content: "Abstract CPOs/EMSPs, unify tariffs, automate receipts, and reduce driver friction.",
    icon: CreditCard,
    size: "medium",
    showChart: true,
  },
  {
    id: "copilot",
    title: "Proactive Operations Co-pilot",
    content: "Detect anomalies, forecast maintenance windows, and recommend interventions.",
    icon: BrainCircuit,
    size: "medium",
    showStats: true,
  },
  {
    id: "open",
    title: "Open Orchestration (Beckn)",
    content: "Discover inventory and offers across partners without lock-in.",
    icon: Network,
    size: "small",
  },
  {
    id: "v2g",
    title: "V2G Pilot",
    content: "Bidirectional energy experiments for load balancing and revenue opportunities.",
    icon: Zap,
    size: "small",
  },
]

function MiniChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: defaultViewportMargin })

  return (
    <div ref={ref} className="flex items-end gap-1.5 h-16 mt-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-primary/80 rounded-sm origin-bottom"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{
            delay: i * 0.06,
            duration: 0.5,
            ease: luxuriousEasing,
          }}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

function MiniLineChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: defaultViewportMargin })

  return (
    <motion.div
      ref={ref}
      className="mt-4 flex items-center gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: luxuriousEasing }}
    >
      <TrendingUp className="h-5 w-5 text-primary" />
      <span className="text-2xl font-bold text-foreground">+15%</span>
      <span className="text-sm text-muted-foreground">efficiency</span>
    </motion.div>
  )
}

export function Features() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} aria-labelledby="capabilities-title">
      <div className="mb-10">
        <motion.h2
          id="capabilities-title"
          className="text-3xl md:text-4xl font-bold text-balance"
          variants={sectionHeaderVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Key Capabilities
        </motion.h2>
        <motion.p
          className="mt-3 text-lg text-muted-foreground max-w-2xl"
          variants={sectionHeaderVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
        >
          A quick look at the platform&apos;s core strengths, designed for fleets and marketplaces.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
        variants={gridCascadeVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Card 1: AI Range - Large spanning 2 cols */}
        <motion.div
          variants={gridItemVariants}
          whileHover={{
            scale: 1.02,
            y: -4,
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
            transition: { duration: 0.25, ease: smoothEasing },
          }}
          className="lg:col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-6 flex flex-col justify-between group cursor-pointer transition-colors"
        >
          <div>
            <motion.div
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <BatteryCharging className="h-6 w-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{features[0].title}</h3>
            <p className="text-muted-foreground leading-relaxed">{features[0].content}</p>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: luxuriousEasing }}
                viewport={{ once: true }}
                style={{ width: "85%" }}
              />
            </div>
            <span className="text-sm font-medium text-primary">85% accuracy</span>
          </div>
        </motion.div>

        {/* Card 2: Integrated Charging */}
        <motion.div
          variants={gridItemVariants}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            transition: { duration: 0.25, ease: smoothEasing },
          }}
          className="rounded-2xl bg-card border border-border p-5 flex flex-col group cursor-pointer transition-colors"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors duration-300">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{features[1].title}</h3>
          <p className="text-sm text-muted-foreground flex-1">{features[1].content}</p>
          <MiniChart />
        </motion.div>

        {/* Card 3: Proactive Operations */}
        <motion.div
          variants={gridItemVariants}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            transition: { duration: 0.25, ease: smoothEasing },
          }}
          className="rounded-2xl bg-card border border-border p-5 flex flex-col group cursor-pointer transition-colors"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors duration-300">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{features[2].title}</h3>
          <p className="text-sm text-muted-foreground flex-1">{features[2].content}</p>
          <MiniLineChart />
        </motion.div>

        {/* Card 4: Open Orchestration */}
        <motion.div
          variants={gridItemVariants}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            transition: { duration: 0.25, ease: smoothEasing },
          }}
          className="rounded-2xl bg-card border border-border p-5 flex flex-col group cursor-pointer transition-colors"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors duration-300">
            <Network className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{features[3].title}</h3>
          <p className="text-sm text-muted-foreground">{features[3].content}</p>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                viewport={{ once: true }}
                className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {i}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              viewport={{ once: true }}
              className="h-8 w-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
            >
              +5
            </motion.div>
          </div>
        </motion.div>

        {/* Card 5: V2G Pilot */}
        <motion.div
          variants={gridItemVariants}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            transition: { duration: 0.25, ease: smoothEasing },
          }}
          className="rounded-2xl bg-gradient-to-br from-accent/30 to-card border border-border p-5 flex flex-col group cursor-pointer transition-colors"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 mb-3 group-hover:bg-accent/30 transition-colors duration-300">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{features[4].title}</h3>
          <p className="text-sm text-muted-foreground">{features[4].content}</p>
          <div className="mt-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Revenue potential: High</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
