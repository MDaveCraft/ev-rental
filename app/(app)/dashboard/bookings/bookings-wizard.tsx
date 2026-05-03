"use client"

import { useMemo, useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Battery,
  Zap,
  ChevronRight,
  Star,
  Filter,
  Check,
  CreditCard,
  Smartphone,
  Building,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRealtimeBookings } from "@/hooks/use-realtime-bookings"
import { createBooking, cancelBooking, type BookingWithVehicle } from "@/lib/actions/bookings"
import type { Vehicle } from "@/lib/db/schema"

const CHARGING_STOPS = [
  { id: 1, name: "Tata Power EZ Charge", location: "Highway NH44, km 45", type: "DC Fast", time: "15 min", cost: 180 },
  { id: 2, name: "EESL Public Charger", location: "Tumkur Road", type: "DC Fast", time: "20 min", cost: 220 },
]

const SERVICE_FEE = 149
const CHARGING_ESTIMATE = 400
const DISCOUNT = 100

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function statusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-primary/15 text-primary border-primary/30"
    case "confirmed":
      return "bg-accent/15 text-accent border-accent/30"
    case "completed":
      return "bg-muted text-muted-foreground"
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

interface BookingsWizardProps {
  vehicles: Vehicle[]
  myBookings: BookingWithVehicle[]
  userName: string
}

export function BookingsWizard({ vehicles, myBookings, userName }: BookingsWizardProps) {
  useRealtimeBookings()

  const [step, setStep] = useState(1)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [filters, setFilters] = useState({
    city: "Bengaluru",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    durationDays: 1,
    vehicleType: "all",
  })
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string
    vehicle: Vehicle
    days: number
    total: number
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.vehicleType !== "all" && v.vehicleType.toLowerCase() !== filters.vehicleType) return false
      if (filters.city && !v.location.toLowerCase().includes(filters.city.toLowerCase())) return false
      return true
    })
  }, [vehicles, filters])

  const total = useMemo(() => {
    if (!selectedVehicle) return 0
    return Number(selectedVehicle.pricePerDay) * filters.durationDays + CHARGING_ESTIMATE + SERVICE_FEE - DISCOUNT
  }, [selectedVehicle, filters.durationDays])

  const handleBookVehicle = (v: Vehicle) => {
    setSelectedVehicle(v)
    setErrorMsg(null)
    setStep(2)
  }

  const handleConfirmPayment = async () => {
    if (!selectedVehicle) return
    setErrorMsg(null)
    setIsProcessing(true)
    try {
      const start = new Date(filters.startDate)
      start.setHours(9, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + filters.durationDays)

      const created = await createBooking({
        vehicleId: selectedVehicle.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        pickupLocation: selectedVehicle.location,
      })
      setConfirmedBooking({
        id: created.id,
        vehicle: selectedVehicle,
        days: filters.durationDays,
        total,
      })
      setStep(4)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Booking failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = (id: string) => {
    startTransition(async () => {
      try {
        await cancelBooking(id)
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Could not cancel booking")
      }
    })
  }

  const upcoming = myBookings.filter((b) => b.status === "confirmed" || b.status === "active")

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header with Stepper */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Book a Trip</h1>
          <p className="text-muted-foreground">
            {userName ? `Welcome back, ${userName.split(" ")[0]}. ` : ""}Find and book your perfect EV
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {["Search", "Trip Details", "Payment", "Confirmation"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn("ml-2 text-sm", step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground")}
              >
                {label}
              </span>
              {i < 3 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Existing bookings strip (shown only on step 1) */}
      {step === 1 && myBookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Your Trips</CardTitle>
                <CardDescription>{upcoming.length} upcoming, {myBookings.length} total</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {myBookings.slice(0, 6).map((b) => (
                <div
                  key={b.id}
                  className="flex gap-3 rounded-lg border bg-card p-3"
                >
                  <img
                    src={b.vehicle.imageUrl || "/placeholder.svg"}
                    alt={b.vehicle.name}
                    className="h-16 w-20 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm truncate">{b.vehicle.name}</p>
                      <Badge variant="outline" className={cn("text-xs", statusColor(b.status))}>
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{b.pickupLocation}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">Rs {Number(b.totalPrice).toLocaleString()}</span>
                      {(b.status === "confirmed" || b.status === "pending") && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => handleCancel(b.id)}
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Search */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        className="pl-10"
                        placeholder="Select city"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (days)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={filters.durationDays}
                        onChange={(e) =>
                          setFilters({ ...filters, durationDays: Math.max(1, Number(e.target.value) || 1) })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full gap-2" type="button">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["all", "SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
                    <Badge
                      key={type}
                      variant={filters.vehicleType === type.toLowerCase() ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => setFilters({ ...filters, vehicleType: type.toLowerCase() })}
                    >
                      {type === "all" ? "All" : type}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="cursor-pointer gap-1">
                    <Filter className="h-3 w-3" />
                    More Filters
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Grid */}
            {filteredVehicles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-medium">No vehicles match your filters</p>
                  <p className="text-sm text-muted-foreground">Try widening your search or changing the city.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVehicles.map((vehicle, i) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group"
                  >
                    <Card className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg hover:shadow-primary/10">
                      <div className="relative h-48 bg-gradient-to-br from-secondary to-secondary/50">
                        <img
                          src={vehicle.imageUrl || "/placeholder.svg"}
                          alt={vehicle.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {Math.round((Number(vehicle.rating ?? 4.5) / 5) * 100)}% confidence
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              Rs {Number(vehicle.pricePerDay).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">/day</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Battery className="h-4 w-4" />
                            {vehicle.rangeKm} km
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            {Number(vehicle.batteryKwh)} kWh
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {vehicle.rating ?? "4.5"}
                          </div>
                        </div>

                        <Button className="mt-4 w-full gap-2" onClick={() => handleBookVehicle(vehicle)}>
                          Book Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Trip Details */}
        {step === 2 && selectedVehicle && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={selectedVehicle.imageUrl || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      className="h-24 w-32 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedVehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.location}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <Badge variant="secondary">{selectedVehicle.vehicleType}</Badge>
                        <span className="flex items-center gap-1">
                          <Battery className="h-4 w-4" />
                          {selectedVehicle.rangeKm} km range
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Charging Plan</CardTitle>
                  <CardDescription>AI-optimized charging stops for your route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-accent" />
                    <div className="space-y-6">
                      <div className="relative flex items-center gap-4 pl-10">
                        <div className="absolute left-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Start: {selectedVehicle.location}</p>
                          <p className="text-sm text-muted-foreground">Full charge - 100% SOC</p>
                        </div>
                      </div>

                      {CHARGING_STOPS.map((stop, i) => (
                        <motion.div
                          key={stop.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="relative flex items-center gap-4 pl-10"
                        >
                          <div className="absolute left-2 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                            <Zap className="h-3 w-3 text-accent-foreground" />
                          </div>
                          <Card className="flex-1">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{stop.name}</p>
                                  <p className="text-xs text-muted-foreground">{stop.location}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary">{stop.type}</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {stop.time} - Rs {stop.cost}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}

                      <div className="relative flex items-center gap-4 pl-10">
                        <div className="absolute left-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Destination: Pune</p>
                          <p className="text-sm text-muted-foreground">
                            {filters.durationDays}-day trip · Estimated arrival: 4h 30m
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental ({filters.durationDays} day{filters.durationDays > 1 ? "s" : ""})</span>
                      <span>Rs {(Number(selectedVehicle.pricePerDay) * filters.durationDays).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Charging</span>
                      <span>Rs {CHARGING_ESTIMATE}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>Rs {SERVICE_FEE}</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Certification Discount</span>
                      <span>-Rs {DISCOUNT}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full gap-2" onClick={() => setStep(3)}>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep(1)}>
                    Change Vehicle
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && selectedVehicle && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you want to pay (mock — no charge will be made)</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {[
                      { value: "upi", label: "UPI", icon: Smartphone, description: "Pay with any UPI app" },
                      { value: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
                      { value: "corporate", label: "Corporate Account", icon: Building, description: "Bill to your company" },
                    ].map((method) => (
                      <div
                        key={method.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all",
                          paymentMethod === method.value ? "border-primary bg-primary/5" : "hover:border-primary/50",
                        )}
                      >
                        <RadioGroupItem value={method.value} id={method.value} />
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <Label htmlFor={method.value} className="cursor-pointer font-medium">
                            {method.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  {paymentMethod === "upi" && (
                    <div className="mt-4">
                      <Label>UPI ID</Label>
                      <Input placeholder="yourname@upi" className="mt-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={selectedVehicle.imageUrl || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{selectedVehicle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {filters.startDate} · {filters.durationDays} day{filters.durationDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental</span>
                      <span>Rs {(Number(selectedVehicle.pricePerDay) * filters.durationDays).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Charging</span>
                      <span>Rs {CHARGING_ESTIMATE}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>Rs {SERVICE_FEE}</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-Rs {DISCOUNT}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>Rs {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 gap-2"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Pay Rs {total.toLocaleString()}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep(2)}>
                    Back to Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && confirmedBooking && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">Your trip is ready. Enjoy your EV experience!</p>

              <Card className="max-w-md mx-auto text-left">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={confirmedBooking.vehicle.imageUrl || "/placeholder.svg"}
                      alt={confirmedBooking.vehicle.name}
                      className="h-20 w-28 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{confirmedBooking.vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{confirmedBooking.vehicle.location}</p>
                      <Badge className="mt-2">Booking #{confirmedBooking.id.slice(0, 8).toUpperCase()}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground">Pickup Date</p>
                      <p className="font-medium">{filters.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {confirmedBooking.days} Day{confirmedBooking.days > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Range</p>
                      <p className="font-medium">{confirmedBooking.vehicle.rangeKm} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Paid</p>
                      <p className="font-medium text-primary">Rs {confirmedBooking.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">View Trip Details</Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setStep(1)
                        setSelectedVehicle(null)
                        setConfirmedBooking(null)
                      }}
                    >
                      Book Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
