"use client"

import { Card, CardContent } from "@/components/ui/card"
import { KpiCounter } from "@/components/kpi-counter"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion"
import { ArrowRight, Zap, Battery } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import {
  luxuriousEasing,
  smoothEasing,
  fadeLeftVariants,
  fadeRightVariants,
  staggerContainerVariants,
  fadeUpVariants,
} from "@/lib/animations"

function FloatingParticles() {
  const [randomX, setRandomX] = useState<number | null>(null);

  useEffect(() => {
    setRandomX(Math.random() * 100);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: Just for now
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: `${randomX}%`,
            y: "110%",
            opacity: 0,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

function MapCard() {
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  const markers = [
    { id: 1, x: 25, y: 30, type: "vehicle", label: "Tesla Model 3" },
    { id: 2, x: 45, y: 55, type: "charger", label: "Supercharger" },
    { id: 3, x: 70, y: 40, type: "vehicle", label: "VW ID.4" },
    { id: 4, x: 60, y: 70, type: "charger", label: "Fast Charge" },
    { id: 5, x: 35, y: 75, type: "vehicle", label: "Rivian R1T" },
  ]

  return (
    <motion.div
      ref={ref}
      variants={fadeRightVariants}
      initial="hidden"
      animate="visible"
      style={{ y }}
      className="relative"
    >
      {/* Ambient glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-2xl opacity-50" />

      <Card className="relative overflow-hidden rounded-2xl border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Live Fleet View</span>
          </div>
          <span className="text-xs text-muted-foreground">12 vehicles online</span>
        </div>

        {/* Map area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted">
          <Image
            src="/ev-rental-dashboard-map.jpg"
            alt="EV rental operations dashboard map"
            fill
            className="object-cover opacity-80"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

          {/* Interactive markers */}
          {markers.map((marker) => (
            <motion.div
              key={marker.id}
              className="absolute"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onHoverStart={() => setHoveredMarker(marker.id)}
              onHoverEnd={() => setHoveredMarker(null)}
            >
              <motion.div
                animate={{
                  scale: hoveredMarker === marker.id ? 1.3 : 1,
                }}
                transition={{ duration: 0.2, ease: smoothEasing }}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full cursor-pointer ${
                  marker.type === "vehicle"
                    ? "bg-primary shadow-lg shadow-primary/50"
                    : "bg-accent shadow-lg shadow-accent/50"
                }`}
              >
                {marker.type === "vehicle" ? (
                  <Zap className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Battery className="h-4 w-4 text-accent-foreground" />
                )}

                {/* Pulse ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full ${marker.type === "vehicle" ? "bg-primary" : "bg-accent"}`}
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>

              {/* Tooltip */}
              {hoveredMarker === marker.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs font-medium shadow-xl"
                >
                  {marker.label}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-px bg-border/50">
          {[
            { label: "Active", value: "12" },
            { label: "Charging", value: "4" },
            { label: "Available", value: "8" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card px-3 py-2.5 text-center">
              <div className="text-lg font-semibold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const glowX = useTransform(springX, [0, 1], ["-20%", "20%"])
  const glowY = useTransform(springY, [0, 1], ["-20%", "20%"])

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" style={{ y: bgY, opacity: bgOpacity }}>
        <motion.div
          className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
          style={{ x: glowX, y: glowY }}
        />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
        <FloatingParticles />
      </motion.div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
          {/* Left column - Text content with directional animation */}
          <motion.div className="flex flex-col gap-6" variants={fadeLeftVariants} initial="hidden" animate="visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: luxuriousEasing }}
            >
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Asset-light EV aggregation with{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    intelligent range
                  </span>
                  <span className="absolute -inset-1 bg-primary/10 blur-lg rounded-lg" />
                </span>{" "}
                and{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    AI assurance
                  </span>
                  <span className="absolute -inset-1 bg-accent/10 blur-lg rounded-lg" />
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: luxuriousEasing }}
              className="text-pretty text-lg text-muted-foreground md:text-xl max-w-lg"
            >
              Integrate fleets, charging, and payments through open protocols with an AI co-pilot for proactive
              operations and V2G pilots.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: luxuriousEasing }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <a href="#features">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <a
                href="#analytics"
                className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                See analytics
                <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right column - Map card with directional animation */}
          <MapCard />
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Fleet Utilization", value: 22, suffix: "%", desc: "Increase via smart dispatch", delay: 0 },
            {
              label: "Range Assurance",
              value: 99.2,
              suffix: "%",
              decimals: 1,
              desc: "AI predicted range confidence",
              delay: 0.1,
            },
            {
              label: "Uptime",
              value: 97.8,
              suffix: "%",
              decimals: 1,
              desc: "Proactive maintenance co-pilot",
              delay: 0.2,
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              variants={fadeUpVariants}
              whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.25, ease: smoothEasing },
              }}
            >
              <Card className="group relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="relative pt-6">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
                  <div className="mt-2 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    <KpiCounter
                      from={0}
                      to={kpi.value}
                      suffix={kpi.suffix}
                      decimals={kpi.decimals || 0}
                      durationMs={1200 + i * 200}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{kpi.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
