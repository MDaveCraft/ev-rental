"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Search, Sparkles, Menu, ChevronDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { CommandPalette } from "./command-palette"
import { AICopilotPanel } from "./ai-copilot-panel"

export function AppNavbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, signOut } = useAuth()
  const [hasNotifications] = useState(true)
  const [showCoPilot, setShowCoPilot] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 transition-all duration-300 lg:px-6",
          scrolled ? "border-border/50 bg-background/80 backdrop-blur-xl" : "border-transparent bg-background",
        )}
      >
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg font-bold text-primary-foreground">H</span>
            </motion.div>
            <span className="hidden font-semibold text-lg md:inline-block">HYMN</span>
          </Link>
        </div>

        {/* Center - Command Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <button onClick={() => setCommandOpen(true)} className="relative w-full group">
            <div className="flex items-center gap-3 w-full rounded-full border border-border/50 bg-secondary/30 px-4 py-2 text-sm transition-all hover:border-primary/50 hover:bg-secondary/50 hover:shadow-md hover:shadow-primary/5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground flex-1 text-left">Search bookings, chargers, settings...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Find Chargers Button - Prominent CTA */}
          <Link href="/dashboard/charging">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 rounded-full border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Zap className="h-4 w-4" />
              <span>Find Chargers</span>
            </Button>
          </Link>

          {/* AI Co-Pilot Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 rounded-full border-primary/30 bg-primary/5 hover:bg-primary/10"
              onClick={() => setShowCoPilot(!showCoPilot)}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary">AI Copilot</span>
            </Button>
          </motion.div>

          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCommandOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
              />
            )}
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      {/* AI Copilot Panel */}
      <AICopilotPanel isOpen={showCoPilot} onClose={() => setShowCoPilot(false)} />
    </>
  )
}
