"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Star,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Shield,
  Info,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { format, isToday, isBefore, startOfDay } from "date-fns"

// Types
interface ChargingStation {
  id: string
  name: string
  address: string
  distance: string
  distanceKm: number
  rating: number
  reviews: number
  reliability: number
  connectors: { type: string; power: string; available: number; total: number }[]
  pricePerKwh: number
  lastVerified: string
  position: { top: string; left: string }
  availability: "high" | "medium" | "low" | "booked"
}

interface TimeSlot {
  time: string
  status: "available" | "reserved" | "user-booked" | "limited"
  price?: number
}

interface UserBooking {
  stationId: string
  date: Date
  startTime: string
  duration: number
  estimatedCost: number
  estimatedRange: number
}

// Mock Data
const chargingStations: ChargingStation[] = [
  {
    id: "st1",
    name: "EV Hub Koramangala",
    address: "80 Feet Road, Koramangala 4th Block",
    distance: "1.2 km",
    distanceKm: 1.2,
    rating: 4.8,
    reviews: 234,
    reliability: 98,
    connectors: [
      { type: "CCS2", power: "50kW", available: 2, total: 4 },
      { type: "Type 2", power: "22kW", available: 1, total: 2 },
    ],
    pricePerKwh: 14,
    lastVerified: "5 mins ago",
    position: { top: "30%", left: "45%" },
    availability: "high",
  },
  {
    id: "st2",
    name: "ChargeZone Indiranagar",
    address: "100 Feet Road, Indiranagar",
    distance: "2.8 km",
    distanceKm: 2.8,
    rating: 4.6,
    reviews: 189,
    reliability: 95,
    connectors: [
      { type: "CCS2", power: "60kW", available: 1, total: 3 },
      { type: "CHAdeMO", power: "50kW", available: 0, total: 1 },
    ],
    pricePerKwh: 15,
    lastVerified: "12 mins ago",
    position: { top: "25%", left: "65%" },
    availability: "medium",
  },
  {
    id: "st3",
    name: "GreenCharge HSR",
    address: "27th Main, HSR Layout",
    distance: "3.5 km",
    distanceKm: 3.5,
    rating: 4.9,
    reviews: 312,
    reliability: 99,
    connectors: [
      { type: "CCS2", power: "150kW", available: 3, total: 4 },
      { type: "Type 2", power: "22kW", available: 2, total: 2 },
    ],
    pricePerKwh: 16,
    lastVerified: "2 mins ago",
    position: { top: "55%", left: "35%" },
    availability: "high",
  },
  {
    id: "st4",
    name: "PowerGrid BTM",
    address: "BTM Layout 2nd Stage",
    distance: "4.1 km",
    distanceKm: 4.1,
    rating: 4.4,
    reviews: 156,
    reliability: 92,
    connectors: [{ type: "CCS2", power: "50kW", available: 0, total: 2 }],
    pricePerKwh: 13,
    lastVerified: "8 mins ago",
    position: { top: "70%", left: "55%" },
    availability: "booked",
  },
  {
    id: "st5",
    name: "Tata Power Whitefield",
    address: "ITPL Main Road, Whitefield",
    distance: "8.2 km",
    distanceKm: 8.2,
    rating: 4.7,
    reviews: 278,
    reliability: 97,
    connectors: [
      { type: "CCS2", power: "120kW", available: 2, total: 6 },
      { type: "Type 2", power: "22kW", available: 3, total: 4 },
    ],
    pricePerKwh: 14.5,
    lastVerified: "1 min ago",
    position: { top: "20%", left: "80%" },
    availability: "high",
  },
]

const generateTimeSlots = (hasUserBooking: boolean, userBookingTime?: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const statuses: ("available" | "reserved" | "limited")[] = [
    "available",
    "reserved",
    "available",
    "limited",
    "available",
    "available",
    "reserved",
    "available",
  ]

  for (let i = 8; i <= 22; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`
    let status: TimeSlot["status"] = statuses[i % statuses.length]

    if (hasUserBooking && time === userBookingTime) {
      status = "user-booked"
    }

    slots.push({
      time,
      status,
      price: status === "available" || status === "user-booked" ? 14 + Math.random() * 4 : undefined,
    })
  }
  return slots
}

const timeOptions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
]

const durationOptions = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
]

export default function ChargingPage() {
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState("14:00")
  const [duration, setDuration] = useState(30)
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(chargingStations[0])
  const [userBooking, setUserBooking] = useState<UserBooking | null>(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>("14:00")

  // Computed
  const isAdvanceBooking = !isToday(selectedDate)
  const hasExistingBooking = userBooking && selectedStation && userBooking.stationId === selectedStation.id
  const timeSlots = generateTimeSlots(!!hasExistingBooking, userBooking?.startTime)

  // Calculate estimated values
  const estimatedCost = selectedStation ? (((duration / 60) * 50 * selectedStation.pricePerKwh) / 100).toFixed(0) : "0"
  const estimatedRange = Math.round((duration / 60) * 80) // ~80km per hour of charging

  // Handlers
  const handleBookSlot = useCallback(() => {
    if (!selectedStation || !selectedSlot) return

    const newBooking: UserBooking = {
      stationId: selectedStation.id,
      date: selectedDate,
      startTime: selectedSlot,
      duration,
      estimatedCost: Number(estimatedCost),
      estimatedRange,
    }
    setUserBooking(newBooking)
    setIsRescheduling(false)
  }, [selectedStation, selectedSlot, selectedDate, duration, estimatedCost, estimatedRange])

  const handleReschedule = useCallback(() => {
    setIsRescheduling(true)
  }, [])

  const handleCancelBooking = useCallback(() => {
    setUserBooking(null)
    setShowCancelConfirm(false)
    setSelectedSlot("14:00")
  }, [])

  const handleConfirmReschedule = useCallback(() => {
    if (!selectedStation || !selectedSlot) return

    setUserBooking({
      stationId: selectedStation.id,
      date: selectedDate,
      startTime: selectedSlot,
      duration,
      estimatedCost: Number(estimatedCost),
      estimatedRange,
    })
    setIsRescheduling(false)
  }, [selectedStation, selectedSlot, selectedDate, duration, estimatedCost, estimatedRange])

  const getAvailabilityColor = (availability: ChargingStation["availability"]) => {
    switch (availability) {
      case "high":
        return "bg-emerald-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-orange-500"
      case "booked":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  const getSlotColor = (status: TimeSlot["status"]) => {
    switch (status) {
      case "available":
        return "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30"
      case "reserved":
        return "bg-muted/50 border-muted"
      case "user-booked":
        return "bg-primary/20 border-primary ring-2 ring-primary/30"
      case "limited":
        return "bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Sticky Context Bar */}
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur-lg">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
          {/* Back Button */}
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[140px] bg-transparent">
                <Calendar className="h-4 w-4" />
                <span>{format(selectedDate, "MMM d, yyyy")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Time Selector */}
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[100px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Duration Selector */}
          <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Context Badge */}
          <Badge
            variant="secondary"
            className={cn(
              "ml-auto",
              isAdvanceBooking ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600",
            )}
          >
            {isAdvanceBooking ? "Planning in advance" : "Booking for today"}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-5 gap-0">
        {/* Map Section (Left - 3 cols) */}
        <div className="lg:col-span-3 relative bg-secondary/30 min-h-[400px] lg:min-h-[calc(100vh-10rem)]">
          {/* Mock Map Image */}
          <Image
            src="/city-street-map-satellite-view-with-roads-and-buil.jpg"
            alt="Map showing charging stations"
            fill
            className="object-cover opacity-50"
          />

          {/* Map overlay for better marker visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />

          {/* Street grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600" preserveAspectRatio="none">
            {/* Major roads */}
            <path d="M0,300 L800,300" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" />
            <path d="M400,0 L400,600" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" />
            {/* Secondary roads */}
            <path d="M0,150 L800,150" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            <path d="M0,450 L800,450" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            <path d="M200,0 L200,600" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            <path d="M600,0 L600,600" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            {/* Minor roads */}
            <path d="M100,0 L100,600" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M300,0 L300,600" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M500,0 L500,600" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M700,0 L700,600" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M0,75 L800,75" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M0,225 L800,225" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M0,375 L800,375" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M0,525 L800,525" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>

          {/* Building blocks for visual interest */}
          <div className="absolute top-[10%] left-[10%] w-16 h-12 bg-muted/30 rounded-sm" />
          <div className="absolute top-[15%] left-[25%] w-20 h-8 bg-muted/30 rounded-sm" />
          <div className="absolute top-[60%] right-[15%] w-24 h-14 bg-muted/30 rounded-sm" />
          <div className="absolute bottom-[20%] left-[15%] w-14 h-10 bg-muted/30 rounded-sm" />
          <div className="absolute top-[40%] right-[40%] w-12 h-16 bg-muted/30 rounded-sm" />

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-blue-500/50"
                animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute -inset-4 rounded-full bg-blue-500/10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Station Markers */}
          {chargingStations.map((station) => (
            <motion.button
              key={station.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 group z-10",
                selectedStation?.id === station.id && "z-20",
              )}
              style={{ top: station.position.top, left: station.position.left }}
              onClick={() => setSelectedStation(station)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center h-11 w-11 rounded-full border-2 bg-background shadow-xl transition-all",
                  selectedStation?.id === station.id
                    ? "border-primary ring-4 ring-primary/30 scale-110"
                    : "border-border hover:border-primary/50",
                )}
              >
                <Zap
                  className={cn(
                    "h-5 w-5",
                    station.availability === "booked" ? "text-muted-foreground" : "text-primary",
                  )}
                />

                {/* Availability Indicator */}
                <span
                  className={cn(
                    "absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background",
                    getAvailabilityColor(station.availability),
                  )}
                />

                {/* Available slots badge */}
                {station.availability !== "booked" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background text-[9px] font-bold px-1.5 rounded-full border shadow-sm">
                    {station.connectors.reduce((acc, c) => acc + c.available, 0)}
                  </span>
                )}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover border rounded-lg shadow-xl px-3 py-2.5 text-sm whitespace-nowrap min-w-[160px]">
                  <p className="font-semibold">{station.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{station.distance} away</p>
                  <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t">
                    <span className="flex items-center gap-1 text-xs">
                      <Zap className="h-3 w-3 text-primary" />
                      {station.connectors.reduce((acc, c) => acc + c.available, 0)} available
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 text-amber-500" />
                      {station.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="h-9 w-9 shadow-lg bg-background">
              <Navigation className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 shadow-lg bg-background text-lg font-bold">
              +
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 shadow-lg bg-background text-lg font-bold">
              −
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg border p-3 shadow-lg">
            <p className="text-xs font-semibold mb-2">Charging Stations</p>
            <div className="space-y-2">
              {[
                { color: "bg-emerald-500", label: "High Availability", count: 3 },
                { color: "bg-amber-500", label: "Medium", count: 1 },
                { color: "bg-red-500", label: "Fully Booked", count: 1 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-xs font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Station count badge */}
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg border px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{chargingStations.length} stations</span>
              <span className="text-xs text-muted-foreground">within 10km</span>
            </div>
          </div>
        </div>

        {/* Station Details Panel (Right - 2 cols) */}
        <div className="lg:col-span-2 border-l bg-background overflow-y-auto max-h-[calc(100vh-10rem)]">
          <AnimatePresence mode="wait">
            {selectedStation ? (
              <motion.div
                key={selectedStation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 lg:p-6 space-y-6"
              >
                {/* Station Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{selectedStation.name}</h2>
                        {hasExistingBooking && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            Your Reservation
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{selectedStation.address}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Navigation className="h-3 w-3" />
                      {selectedStation.distance}
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{selectedStation.rating}</span>
                      <span className="text-muted-foreground">({selectedStation.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Shield className="h-4 w-4" />
                      <span>{selectedStation.reliability}% reliable</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Info className="h-3.5 w-3.5" />
                      <span className="text-xs">Verified {selectedStation.lastVerified}</span>
                    </div>
                  </div>
                </div>

                {/* Connectors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Connectors</h3>
                  <div className="grid gap-2">
                    {selectedStation.connectors.map((connector, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          connector.available > 0 ? "bg-card" : "bg-muted/50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center",
                              connector.available > 0 ? "bg-primary/10" : "bg-muted",
                            )}
                          >
                            <Zap
                              className={cn(
                                "h-4 w-4",
                                connector.available > 0 ? "text-primary" : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{connector.type}</p>
                            <p className="text-xs text-muted-foreground">{connector.power}</p>
                          </div>
                        </div>
                        <Badge
                          variant={connector.available > 0 ? "secondary" : "outline"}
                          className={connector.available > 0 ? "bg-emerald-500/10 text-emerald-600" : ""}
                        >
                          {connector.available}/{connector.total} available
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Availability Timeline</h3>
                    <span className="text-xs text-muted-foreground">{format(selectedDate, "EEEE, MMM d")}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => {
                          if (slot.status === "available" || slot.status === "limited") {
                            setSelectedSlot(slot.time)
                          }
                        }}
                        disabled={slot.status === "reserved"}
                        className={cn(
                          "relative p-2 rounded-md border text-center transition-all",
                          getSlotColor(slot.status),
                          selectedSlot === slot.time && slot.status !== "user-booked" && "ring-2 ring-primary",
                          slot.status === "reserved" && "cursor-not-allowed opacity-60",
                        )}
                      >
                        <span className="text-xs font-medium">{slot.time}</span>
                        {slot.status === "user-booked" && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Timeline Legend */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Limited</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted" />
                      <span>Reserved</span>
                    </div>
                    {hasExistingBooking && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>Your Booking</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Summary Card */}
                <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      {hasExistingBooking && !isRescheduling ? "Your Reservation" : "Booking Summary"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Station</p>
                        <p className="font-medium">{selectedStation.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Date</p>
                        <p className="font-medium">{format(selectedDate, "MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Time</p>
                        <p className="font-medium">{selectedSlot || selectedTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Duration</p>
                        <p className="font-medium">{duration} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Est. Range Gain</p>
                        <p className="font-medium text-emerald-600">+{estimatedRange} km</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Est. Cost</p>
                        <p className="font-medium">₹{estimatedCost}</p>
                      </div>
                    </div>

                    {isAdvanceBooking && (
                      <div className="flex items-start gap-2 p-2 rounded-md bg-primary/10 text-xs">
                        <Info className="h-3.5 w-3.5 text-primary mt-0.5" />
                        <span className="text-primary">
                          Advance reservation · Free cancellation until 2 hours before start
                        </span>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    {hasExistingBooking && !isRescheduling ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReschedule}>
                          <Calendar className="h-4 w-4" />
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => setShowCancelConfirm(true)}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    ) : isRescheduling ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Select a new time slot above. Your previous slot will be released automatically.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => setIsRescheduling(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleConfirmReschedule} className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Confirm Reschedule
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full gap-2" size="lg" onClick={handleBookSlot}>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm Charging Slot
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Smart Guidance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Smart Suggestions</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      "Traffic may delay arrival — consider starting 15 mins later",
                      "Lower price available if you shift to 5:30 PM",
                    ].map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-secondary/50 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center space-y-2">
                  <Zap className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Select a station on the map</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cancel Confirmation Panel */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-background border rounded-t-2xl lg:rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cancel charging slot?</h3>
                    <p className="text-sm text-muted-foreground">You won't be charged if you cancel now.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                    Keep Reservation
                  </Button>
                  <Button variant="destructive" onClick={handleCancelBooking}>
                    Confirm Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
