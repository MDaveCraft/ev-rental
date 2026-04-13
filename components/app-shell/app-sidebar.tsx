"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Calendar,
  Car,
  Zap,
  GraduationCap,
  Leaf,
  Plug,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coins,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["renter", "contractor", "admin"] },
  { label: "Bookings", href: "/dashboard/bookings", icon: Calendar, roles: ["renter", "contractor", "admin"] },
  { label: "Fleet & Contractors", href: "/dashboard/fleet", icon: Car, roles: ["contractor", "admin"] },
  { label: "Charging & V2G", href: "/dashboard/charging", icon: Zap, roles: ["renter", "contractor", "admin"] },
  { label: "V2G Credits", href: "/dashboard/v2g-credits", icon: Coins, roles: ["renter", "contractor", "admin"] },
  { label: "Education", href: "/dashboard/education", icon: GraduationCap, roles: ["renter", "contractor"] },
  { label: "Sustainability", href: "/dashboard/sustainability", icon: Leaf, roles: ["admin"] },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug, roles: ["admin"] },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard, roles: ["renter", "contractor", "admin"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["renter", "contractor", "admin"] },
]

export function AppSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role))

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 },
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={mounted ? (isOpen ? "open" : "closed") : false}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] flex-col border-r bg-sidebar transition-all lg:relative lg:top-0 lg:z-0 lg:translate-x-0",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {filteredItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Hover glow */}
                    <span className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="hidden border-t p-3 lg:block">
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full justify-center">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
