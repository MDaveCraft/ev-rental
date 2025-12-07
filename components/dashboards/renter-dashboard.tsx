"use client"

import { motion } from "framer-motion"
import { Car, MapPin, Battery, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export function RenterDashboard() {
  const { user } = useAuth()

  const upcomingTrips = [
    { id: 1, vehicle: "Tata Nexon EV", date: "Dec 8, 2025", location: "Bengaluru", status: "Confirmed" },
    { id: 2, vehicle: "MG ZS EV", date: "Dec 15, 2025", location: "Pune", status: "Pending" },
  ]

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here is your EV rental overview</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <Button className="gap-2">
          <Car className="h-4 w-4" />
          Book a Trip
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <MapPin className="h-4 w-4" />
          Find Chargers
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Trips", value: "12", icon: Car, trend: "+2 this month" },
          { label: "Distance Covered", value: "1,847 km", icon: TrendingUp, trend: "+234 km" },
          { label: "Avg. Range Confidence", value: "94%", icon: Battery, trend: "Excellent" },
          { label: "Next Trip", value: "Dec 8", icon: Calendar, trend: "In 2 days" },
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

      {/* Upcoming Trips */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Your scheduled EV rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{trip.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.date} - {trip.location}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      trip.status === "Confirmed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"
                    }`}
                  >
                    {trip.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
