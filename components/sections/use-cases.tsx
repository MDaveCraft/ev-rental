"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Building2, Truck, Plane, Users, GraduationCap, Landmark, ArrowUpRight } from "lucide-react"
import { useRef } from "react"
import {
  luxuriousEasing,
  smoothEasing,
  gridCascadeVariants,
  gridItemVariants,
  sectionHeaderVariants,
} from "@/lib/animations"

const useCases = [
  {
    title: "Corporate Mobility",
    desc: "Pooled EVs for employees with centralized billing and expense management.",
    icon: Building2,
    stat: "40%",
    statLabel: "Cost Reduction",
    size: "large",
  },
  {
    title: "Last-mile Logistics",
    desc: "Optimized routing with charge stops and range assurance.",
    icon: Truck,
    stat: "2.5M",
    statLabel: "Deliveries/Month",
    size: "medium",
  },
  {
    title: "Tourism Rentals",
    desc: "City/airport desks with simplified charging for visitors.",
    icon: Plane,
    stat: "98%",
    statLabel: "Satisfaction",
    size: "small",
  },
  {
    title: "Ride-sharing Partners",
    desc: "Asset-light supply expansion with utilization guarantees.",
    icon: Users,
    stat: "85%",
    statLabel: "Utilization Rate",
    size: "medium",
  },
  {
    title: "Campus Fleets",
    desc: "Universities, parks—shared EVs with geofenced operations.",
    icon: GraduationCap,
    stat: "120+",
    statLabel: "Campuses",
    size: "small",
  },
  {
    title: "Municipal Services",
    desc: "Waste, utilities, parking patrol—predictive maintenance.",
    icon: Landmark,
    stat: "60%",
    statLabel: "Downtime Reduced",
    size: "large",
  },
]

export function UseCases() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])

  return (
    <div ref={containerRef} className="relative">
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: glowOpacity }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10">
        {/* Header with scroll reveal */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12"
        >
          <motion.span
            className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, ease: luxuriousEasing }}
          >
            Use Cases
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Real-world Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Powering mobility transformation across industries with enterprise-grade solutions.
          </p>
        </motion.div>

        <motion.div
          variants={gridCascadeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]"
        >
          {useCases.map((useCase) => {
            const Icon = useCase.icon
            const isLarge = useCase.size === "large"
            const isMedium = useCase.size === "medium"

            return (
              <motion.div
                key={useCase.title}
                variants={gridItemVariants}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.25, ease: smoothEasing },
                }}
                className={`
                  group relative overflow-hidden rounded-2xl
                  bg-gradient-to-br from-card/80 to-card border border-border/50
                  backdrop-blur-sm cursor-pointer
                  ${isLarge ? "md:col-span-2 md:row-span-2" : ""}
                  ${isMedium ? "md:row-span-2" : ""}
                `}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-teal-500/5 transition-all duration-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>

                <div className="relative h-full p-6 flex flex-col">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{useCase.desc}</p>
                  </div>

                  {/* Stats - only show on larger cards */}
                  {(isLarge || isMedium) && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-primary">{useCase.stat}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {useCase.statLabel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
