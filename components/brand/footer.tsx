"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Linkedin, Twitter, Instagram, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import {
  luxuriousEasing,
  smoothEasing,
  staggerContainerVariants,
  footerItemVariants,
  particleTextVariants,
} from "@/lib/animations"

function ParticleText({ text }: { text: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-center gap-1 md:gap-2"
      variants={particleTextVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {text.split("").map((char, i) => (
        <ParticleLetter key={i} char={char} index={i} isInView={isInView} />
      ))}
    </motion.div>
  )
}

function ParticleLetter({ char, index, isInView }: { char: string; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; rotation: number }[]>([])

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        rotation: Math.random() * 360,
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isHovered])

  if (char === " ") {
    return <span className="w-4 md:w-8" />
  }

  return (
    <motion.span
      className="relative inline-block cursor-pointer select-none text-5xl md:text-7xl lg:text-8xl font-bold text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              x: [0, -2, 2, -1, 1, 0],
            }
          : {}
      }
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        x: { delay: index * 0.05 + 0.3, duration: 0.4, ease: "easeOut" },
      }}
    >
      {/* Main letter */}
      <motion.span
        className="relative z-10"
        animate={{
          opacity: isHovered ? 0.2 : 1,
          scale: isHovered ? 0.9 : 1,
          filter: isHovered ? "blur(2px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: smoothEasing }}
      >
        {char}
      </motion.span>

      {/* Particles */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-bold pointer-events-none"
          style={{
            color: particle.id % 3 === 0 ? "#10b981" : particle.id % 3 === 1 ? "#14b8a6" : "#ffffff",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: isHovered ? particle.x : 0,
            y: isHovered ? particle.y : 0,
            opacity: isHovered ? [1, 0.8, 0.6] : 1,
            scale: isHovered ? [1, 0.6, 0.3] : 1,
            rotate: isHovered ? particle.rotation : 0,
          }}
          transition={{
            duration: 0.6,
            ease: smoothEasing,
          }}
        >
          {char}
        </motion.span>
      ))}

      {/* Glow effect on hover */}
      <motion.span
        className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-bold text-primary blur-lg pointer-events-none"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {char}
      </motion.span>
    </motion.span>
  )
}

export function Footer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 0.4])

  return (
    <footer ref={containerRef} className="relative overflow-hidden bg-[#0a0a0a]">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: glowOpacity }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-accent/20 rounded-full blur-[100px]" />
      </motion.div>

      {/* Main footer content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-8">
        {/* Big brand text with particle effect */}
        <div className="flex justify-center mb-20">
          <ParticleText text="EV Rental" />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Brand column */}
          <motion.div variants={footerItemVariants} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="font-semibold text-white text-lg">EV Rental</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Asset-light EV aggregation with AI range assurance and integrated charging.
            </p>
          </motion.div>

          {/* The Good */}
          <motion.div variants={footerItemVariants}>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">The Good</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Careers", "Blog"].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href="#"
                    className="text-sm text-neutral-400 hover:text-primary transition-all duration-300 relative group inline-block"
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* The Boring */}
          <motion.div variants={footerItemVariants}>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">The Boring</h3>
            <ul className="space-y-3">
              {["Terms of Use", "Privacy Policy", "Cookie Policy", "Contact"].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href="#"
                    className="text-sm text-neutral-400 hover:text-primary transition-all duration-300 relative group inline-block"
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* The Cool */}
          <motion.div variants={footerItemVariants}>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">The Cool</h3>
            <ul className="space-y-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href="#"
                    className="text-sm text-neutral-400 hover:text-accent transition-all duration-300 flex items-center gap-3 group"
                  >
                    <span className="relative">
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="absolute inset-0 rounded-full bg-accent/0 group-hover:bg-accent/20 blur-md transition-all duration-300 scale-150" />
                    </span>
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Animated divider line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: luxuriousEasing }}
          />

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} EV Rental System 3.0. All rights reserved.
            </p>
            <p className="text-xs text-neutral-600">Built for fleets, powered by intelligence.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
