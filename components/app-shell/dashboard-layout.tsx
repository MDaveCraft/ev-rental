"use client"

import type React from "react"

import { useState } from "react"
import { AppNavbar } from "./app-navbar"
import { AppSidebar } from "./app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Client-side redirect if not authenticated
  if (!user) {
    return null // Will be handled by layout
  }

  const isMainDashboard = pathname === "/dashboard"
  const isChargingPage = pathname === "/dashboard/charging"

  if (isMainDashboard || isChargingPage) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1">
          {isChargingPage ? children : <div className="mx-auto max-w-6xl px-4 py-4 lg:px-6">{children}</div>}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
