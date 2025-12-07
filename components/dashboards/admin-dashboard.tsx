"use client"

import { motion } from "framer-motion"
import { Car, TrendingUp, Zap, Activity, Leaf, Globe, Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

const marketData = [
  { year: "2024", value: 25 },
  { year: "2025", value: 38 },
  { year: "2026", value: 55 },
  { year: "2027", value: 78 },
  { year: "2028", value: 105 },
  { year: "2029", value: 145 },
  { year: "2030", value: 200 },
]

const demandForecast = [
  { day: "Mon", bookings: 124 },
  { day: "Tue", bookings: 145 },
  { day: "Wed", bookings: 132 },
  { day: "Thu", bookings: 178 },
  { day: "Fri", bookings: 210 },
  { day: "Sat", bookings: 245 },
  { day: "Sun", bookings: 198 },
]

export function AdminDashboard() {
  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold">Platform Overview</h1>
        <p className="text-muted-foreground">System health, integrations, and market analytics</p>
      </motion.div>

      {/* Hero KPIs */}
      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Active Vehicles", value: "2,847", icon: Car },
          { label: "Today's Bookings", value: "1,234", icon: TrendingUp },
          { label: "Avg Range Confidence", value: "92%", icon: Activity },
          { label: "Charging Utilization", value: "78%", icon: Zap },
          { label: "Monthly ARR", value: "Rs 4.2Cr", icon: TrendingUp },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{kpi.value}</div>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-accent/50" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Market Trajectory */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>EV Rental Market Trajectory</CardTitle>
              <CardDescription>Projected growth to $200B by 2035</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demand Forecast */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>Predicted bookings for next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="bookings" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Health */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Booking Latency", value: "45ms", status: "healthy" },
                { label: "Error Rate", value: "0.02%", status: "healthy" },
                { label: "Kafka Lag", value: "12 msgs", status: "healthy" },
                { label: "Region Uptime", value: "99.98%", status: "healthy" },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Beckn Integrations */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Beckn Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { bap: "Yulu BAP", bookings: "234/day" },
                { bap: "Bounce BAP", bookings: "189/day" },
                { bap: "Ola Electric BAP", bookings: "156/day" },
              ].map((integration) => (
                <div key={integration.bap} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{integration.bap}</span>
                  <span className="text-sm text-muted-foreground">{integration.bookings}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ESG & Sustainability */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">12,450</div>
                <p className="text-sm text-muted-foreground">Tonnes CO2 Saved</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold">2,340</div>
                  <p className="text-xs text-muted-foreground">Carbon Credits</p>
                </div>
                <div>
                  <div className="text-xl font-semibold">89%</div>
                  <p className="text-xs text-muted-foreground">Green Energy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
