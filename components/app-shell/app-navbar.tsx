"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Search, Sparkles, Menu, X, ChevronDown } from "lucide-react"
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

export function AppNavbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, signOut } = useAuth()
  const [hasNotifications] = useState(true)
  const [showCoPilot, setShowCoPilot] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
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

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles, bookings, contractors..."
            className="w-full rounded-full border border-border/50 bg-secondary/50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* AI Co-Pilot Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 rounded-full border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={() => setShowCoPilot(!showCoPilot)}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary">AI Co-Pilot</span>
          </Button>
        </motion.div>

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

      {/* AI Co-Pilot Panel */}
      <AnimatePresence>
        {showCoPilot && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-4 top-16 z-50 w-80 rounded-xl border bg-card p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI Co-Pilot</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCoPilot(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Suggestions based on current data:</p>
              <div className="space-y-2">
                {[
                  "Upsize fleet in Pune this weekend",
                  "3 vehicles need maintenance soon",
                  "V2G revenue opportunity detected",
                ].map((suggestion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg border bg-secondary/50 p-2 cursor-pointer hover:bg-secondary transition-colors"
                  >
                    {suggestion}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
