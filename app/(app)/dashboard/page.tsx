"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { RenterDashboard } from "@/components/dashboards/renter-dashboard"
import { ContractorDashboard } from "@/components/dashboards/contractor-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {user.role === "renter" && <RenterDashboard />}
      {user.role === "contractor" && <ContractorDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </motion.div>
  )
}
