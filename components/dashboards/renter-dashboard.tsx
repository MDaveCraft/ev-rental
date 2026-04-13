"use client"

import { motion } from "framer-motion"
import { Car, Battery, TrendingUp, Calendar, Zap, Sparkles, Search, MapPin, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Image from "next/image"

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
}

export function RenterDashboard() {
  const { user } = useAuth()

  const upcomingTrips = [
    {
      id: 1,
      vehicle: "Tata Nexon EV",
      date: "Dec 8, 2025",
      location: "Bengaluru",
      status: "Confirmed",
      image: "/tata-nexon-ev-white-electric-car.jpg",
    },
    {
      id: 2,
      vehicle: "MG ZS EV",
      date: "Dec 15, 2025",
      location: "Pune",
      status: "Pending",
      image: "/mg-zs-ev-blue-electric-suv.jpg",
    },
  ]

  const smartInsights = [
    "High demand expected in Bengaluru this weekend",
    "Charging slots auto-reserved for your next trip",
    "You qualify for a 5% discount by completing EV Basics",
  ]

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Hero Booking Zone */}
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-5">
        {/* Booking Launcher Card - Primary CTA (takes 3 columns) */}
        <Card className="relative overflow-hidden lg:col-span-3 border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

          <CardContent className="p-5 lg:p-6">
            <div className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
                  Welcome back, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground">Where are you driving today?</p>
              </div>

              <Link href="/dashboard/bookings" className="block">
                <div className="group relative cursor-pointer">
                  <div className="flex items-center gap-3 rounded-full border-2 border-border/50 bg-secondary/30 px-4 py-3 transition-all hover:border-primary/50 hover:bg-secondary/50 hover:shadow-md hover:shadow-primary/5">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">City, pickup date & time</span>
                  </div>
                </div>
              </Link>

              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard/bookings">
                  <Button className="gap-2 rounded-full px-5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                    <Car className="h-4 w-4" />
                    Book a Trip
                  </Button>
                </Link>
                <Link href="/dashboard/charging">
                  <Button variant="outline" className="gap-2 rounded-full px-5 bg-transparent hover:bg-secondary/50">
                    <Zap className="h-4 w-4" />
                    Find Chargers
                  </Button>
                </Link>
                <Link href="/dashboard/v2g-credits">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full px-5 bg-transparent hover:bg-amber-500/10 border-amber-500/30 text-amber-600 hover:text-amber-500 hover:border-amber-500/50"
                  >
                    <Coins className="h-4 w-4" />
                    V2G Credits
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden lg:col-span-2 border-border/50 bg-card/50">
          <CardContent className="p-0 h-full min-h-[220px]">
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {/* Mock Map Background Image */}
              <Image
                src="/city-street-map-with-roads-dark-theme-minimal.jpg"
                alt="Map showing nearby EVs"
                fill
                className="object-cover opacity-60"
              />

              {/* Map overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

              {/* Road lines overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300">
                {/* Main roads */}
                <path d="M0,150 Q100,140 200,150 T400,145" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                <path d="M200,0 Q190,75 200,150 T210,300" stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
                <path d="M50,50 L150,120 L300,80" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />
                <path d="M80,250 Q200,200 350,220" stroke="hsl(var(--border))" strokeWidth="5" fill="none" />
              </svg>

              {/* EV Markers with pulse */}
              <motion.div
                className="absolute top-[25%] left-[30%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                    <Car className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                  <div className="absolute -inset-1 rounded-full bg-primary/30 animate-ping" />
                </div>
              </motion.div>
              <motion.div
                className="absolute top-[45%] left-[55%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
              >
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                    <Car className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute top-[65%] left-[25%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.2 }}
              >
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                    <Car className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute top-[35%] right-[20%]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                    <Car className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </div>
              </motion.div>

              {/* Charger Markers */}
              <div className="absolute top-[30%] right-[35%] h-3 w-3 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
                <Zap className="h-2 w-2 text-amber-950" />
              </div>
              <div className="absolute bottom-[30%] right-[25%] h-3 w-3 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
                <Zap className="h-2 w-2 text-amber-950" />
              </div>
              <div className="absolute top-[55%] left-[40%] h-3 w-3 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
                <Zap className="h-2 w-2 text-amber-950" />
              </div>

              {/* User location marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-blue-500/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </div>

              {/* Map Legend/Badge */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1.5 text-xs shadow-sm">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="font-medium">12 EVs nearby</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live availability
                </div>
                <div className="flex gap-1.5 text-[10px] bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> EVs
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Chargers
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Strip */}
      <motion.div variants={fadeUp} className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Trips", value: "12", trend: "+2 this month", icon: Car },
          { label: "Distance", value: "1,847 km", trend: null, icon: TrendingUp },
          { label: "Range Confidence", value: "94%", trend: "Excellent", icon: Battery },
          { label: "Next Trip", value: "Dec 8", trend: "In 2 days", icon: Calendar },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
          >
            <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {kpi.label}
                    </p>
                    <p className="text-xl lg:text-2xl font-bold">{kpi.value}</p>
                    {kpi.trend && <p className="text-[10px] lg:text-xs text-primary">{kpi.trend}</p>}
                  </div>
                  <kpi.icon className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Live Context Section */}
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {upcomingTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center justify-between rounded-lg border border-border/50 p-2.5 cursor-pointer transition-all hover:bg-secondary/50 hover:border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 rounded-md overflow-hidden bg-secondary">
                    <Image src={trip.image || "/placeholder.svg"} alt={trip.vehicle} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{trip.vehicle}</p>
                    <p className="text-xs text-muted-foreground">
                      {trip.date} · {trip.location}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    trip.status === "Confirmed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {trip.status}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Smart Insights */}
        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Smart Suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {smartInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-2.5 rounded-lg border border-border/50 p-2.5 text-sm transition-colors hover:bg-secondary/30"
              >
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground text-xs lg:text-sm">{insight}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
