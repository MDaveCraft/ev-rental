"use client"

import { motion } from "framer-motion"
import { Car, TrendingUp, Zap, AlertTriangle, DollarSign, Battery } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export function ContractorDashboard() {
  const { user } = useAuth()

  const fleetData = [
    { id: 1, vehicle: "Tata Nexon EV #001", soc: 85, status: "Available", location: "Bengaluru" },
    { id: 2, vehicle: "MG ZS EV #002", soc: 42, status: "In Trip", location: "Pune" },
    { id: 3, vehicle: "Mahindra XUV400 #003", soc: 28, status: "Charging", location: "Bengaluru" },
    { id: 4, vehicle: "Tata Tigor EV #004", soc: 91, status: "Available", location: "Hyderabad" },
  ]

  const alerts = [
    { id: 1, message: "Nexon EV #003 due for maintenance in 500 km", severity: "warning" },
    { id: 2, message: "Low SOC alert: ZS EV #002 at 42%", severity: "info" },
  ]

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold">Fleet Dashboard</h1>
        <p className="text-muted-foreground">Manage your EV fleet and track earnings</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Vehicles", value: "24", icon: Car, trend: "+4 this month" },
          { label: "Active Trips", value: "8", icon: TrendingUp, trend: "33% utilization" },
          { label: "V2G Revenue", value: "Rs 45,200", icon: Zap, trend: "+Rs 8,400 this week" },
          { label: "Monthly Earnings", value: "Rs 2.4L", icon: DollarSign, trend: "+18% vs last month" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-primary">{kpi.trend}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-accent/50" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Fleet Table & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fleet Overview */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Overview</CardTitle>
              <CardDescription>Real-time status of your vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fleetData.map((vehicle, i) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{vehicle.vehicle}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm font-medium ${vehicle.soc < 30 ? "text-destructive" : ""}`}>
                          {vehicle.soc}%
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          vehicle.status === "Available"
                            ? "bg-primary/10 text-primary"
                            : vehicle.status === "In Trip"
                              ? "bg-accent/10 text-accent-foreground"
                              : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Fleet Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-lg border p-3 text-sm ${
                      alert.severity === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-border"
                    }`}
                  >
                    {alert.message}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
