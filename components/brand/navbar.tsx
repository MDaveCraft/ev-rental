"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/brand/mode-toggle"
import { motion, useScroll, useTransform } from "framer-motion"
import { Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { smoothEasing } from "@/lib/animations"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { scrollY } = useScroll()

  const bgOpacity = useTransform(scrollY, [0, 40], [0.6, 0.95])
  const borderOpacity = useTransform(scrollY, [0, 40], [0, 0.15])
  const shadowOpacity = useTransform(scrollY, [0, 40], [0, 0.1])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Detect active section
      const sections = ["overview", "features", "analytics", "use-cases"]
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { href: "#features", label: "Features", id: "features" },
    { href: "#analytics", label: "Analytics", id: "analytics" },
    { href: "#use-cases", label: "Use Cases", id: "use-cases" },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: smoothEasing }}
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(10, 10, 10, ${v})`),
      }}
      className="sticky top-0 z-50 backdrop-blur-xl"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        style={{ opacity: borderOpacity }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
        style={{ opacity: shadowOpacity }}
      />

      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="#hero" className="group flex items-center gap-2.5">
          <motion.div
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className="h-4 w-4 text-primary-foreground" />
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <span className="font-semibold tracking-wide text-foreground">
            EV Rental <span className="text-primary">3.0</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className={`relative px-3 py-1.5 text-sm tracking-wide transition-colors duration-300 ${
                activeSection === l.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
              {activeSection === l.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Button
              asChild
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/sign-in">
                <span className="relative z-10">Get Started</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
