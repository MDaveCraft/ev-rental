"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const VEHICLES = [
  {
    id: 1,
    name: "Tata Nexon EV Max",
    type: "SUV",
    range: 437,
    price: 2499,
    rating: 4.8,
    reviews: 234,
    location: "Koramangala, Bengaluru",
    image: "/tata-nexon-ev-max-side-view.jpg",
    confidence: 94,
    chargeTime: "45 min",
  },
  {
    id: 2,
    name: "MG ZS EV",
    type: "SUV",
    range: 461,
    price: 2899,
    rating: 4.7,
    reviews: 189,
    location: "Indiranagar, Bengaluru",
    image: "/mg-zs-ev-side-profile.jpg",
    confidence: 91,
    chargeTime: "50 min",
  },
  {
    id: 3,
    name: "Tata Tigor EV",
    type: "Sedan",
    range: 315,
    price: 1799,
    rating: 4.6,
    reviews: 312,
    location: "HSR Layout, Bengaluru",
    image: "/tata-tigor-ev-compact-sedan.jpg",
    confidence: 96,
    chargeTime: "40 min",
  },
  {
    id: 4,
    name: "Mahindra XUV400",
    type: "SUV",
    range: 456,
    price: 2699,
    rating: 4.5,
    reviews: 156,
    location: "Whitefield, Bengaluru",
    image: "/mahindra-xuv400-electric-suv.jpg",
    confidence: 89,
    chargeTime: "55 min",
  },
]

const CHARGING_STOPS = [
  { id: 1, name: "Tata Power EZ Charge", location: "Highway NH44, km 45", type: "DC Fast", time: "15 min", cost: 180 },
  { id: 2, name: "EESL Public Charger", location: "Tumkur Road", type: "DC Fast", time: "20 min", cost: 220 },
]

export default function BookingsPage() {
  const [step, setStep] = useState(1)
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof VEHICLES)[0] | null>(null)
  const [filters, setFilters] = useState({
    city: "Bengaluru",
    date: "",
    duration: "1 day",
    vehicleType: "all",
  })
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleBookVehicle = (vehicle: (typeof VEHICLES)[0]) => {
    setSelectedVehicle(vehicle)
    setStep(2)
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    setStep(4)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header with Stepper */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Book a Trip</h1>
          <p className="text-muted-foreground">Find and book your perfect EV</p>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {["Search", "Trip Details", "Payment", "Confirmation"].map((label, i) => (
            <div key={label} className="flex items-center">
              <motion.div
                animate={{
                  scale: step === i + 1 ? 1.1 : 1,
                  backgroundColor: step >= i + 1 ? "rgb(var(--primary))" : "rgb(var(--muted))",
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                  step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
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

      <AnimatePresence mode="wait">
        {/* Step 1: Search & Vehicle Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Search Filters */}
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
                    <Label>Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="date" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={filters.duration} className="pl-10" placeholder="1 day" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {["All", "SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
                    <Badge
                      key={type}
                      variant={filters.vehicleType === type.toLowerCase() ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFilters({ ...filters, vehicleType: type.toLowerCase() })}
                    >
                      {type}
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
            <div className="grid gap-4 md:grid-cols-2">
              {VEHICLES.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group"
                >
                  <Card className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 bg-gradient-to-br from-secondary to-secondary/50">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="h-full w-full object-cover"
                      />
                      {/* AI Confidence Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {vehicle.confidence}% confidence
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">Rs {vehicle.price}</p>
                          <p className="text-xs text-muted-foreground">/day</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Battery className="h-4 w-4" />
                          {vehicle.range} km
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          {vehicle.chargeTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {vehicle.rating}
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
          </motion.div>
        )}

        {/* Step 2: Trip Details & Charging Plan */}
        {step === 2 && selectedVehicle && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Vehicle */}
              <Card>
                <CardHeader>
                  <CardTitle>Selected Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={selectedVehicle.image || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      className="h-24 w-32 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedVehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.location}</p>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <Badge variant="secondary">{selectedVehicle.type}</Badge>
                        <span className="flex items-center gap-1">
                          <Battery className="h-4 w-4" />
                          {selectedVehicle.range} km range
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route & Charging Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Charging Plan</CardTitle>
                  <CardDescription>AI-optimized charging stops for your route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Route visualization */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-accent" />

                    <div className="space-y-6">
                      {/* Start */}
                      <div className="relative flex items-center gap-4 pl-10">
                        <div className="absolute left-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Start: {selectedVehicle.location}</p>
                          <p className="text-sm text-muted-foreground">Full charge - 100% SOC</p>
                        </div>
                      </div>

                      {/* Charging Stops */}
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

                      {/* End */}
                      <div className="relative flex items-center gap-4 pl-10">
                        <div className="absolute left-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Destination: Pune</p>
                          <p className="text-sm text-muted-foreground">Estimated arrival: 4h 30m</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental (1 day)</span>
                      <span>Rs {selectedVehicle.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Charging</span>
                      <span>Rs 400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>Rs 149</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Certification Discount</span>
                      <span>-Rs 100</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs {selectedVehicle.price + 400 + 149 - 100}</span>
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
                  <CardDescription>Choose how you want to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {[
                      { value: "upi", label: "UPI", icon: Smartphone, description: "Pay with any UPI app" },
                      {
                        value: "card",
                        label: "Credit/Debit Card",
                        icon: CreditCard,
                        description: "Visa, Mastercard, RuPay",
                      },
                      {
                        value: "corporate",
                        label: "Corporate Account",
                        icon: Building,
                        description: "Bill to your company",
                      },
                    ].map((method) => (
                      <motion.div
                        key={method.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
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
                      </motion.div>
                    ))}
                  </RadioGroup>

                  {paymentMethod === "upi" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4"
                    >
                      <Label>UPI ID</Label>
                      <Input placeholder="yourname@upi" className="mt-2" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={selectedVehicle.image || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{selectedVehicle.name}</p>
                      <p className="text-xs text-muted-foreground">Dec 8, 2025 - 1 day</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental</span>
                      <span>Rs {selectedVehicle.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Charging</span>
                      <span>Rs 400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>Rs 149</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-Rs 100</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>Rs {selectedVehicle.price + 400 + 149 - 100}</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full h-12 gap-2 relative overflow-hidden"
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        </motion.div>
                      ) : (
                        <>
                          Pay Rs {selectedVehicle.price + 400 + 149 - 100}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                      {/* Pulse effect */}
                      {!isProcessing && (
                        <motion.div
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="absolute inset-0 bg-primary-foreground/20 rounded-lg"
                        />
                      )}
                    </Button>
                  </motion.div>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep(2)}>
                    Back to Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedVehicle && (
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
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="h-16 w-16 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="h-8 w-8 text-primary-foreground" />
                </motion.div>
              </div>
              {/* Celebration particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5],
                    x: Math.cos((i * Math.PI) / 4) * 60,
                    y: Math.sin((i * Math.PI) / 4) * 60,
                  }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.8 }}
                  className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: i % 2 === 0 ? "#10b981" : "#14b8a6" }}
                />
              ))}
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
                      src={selectedVehicle.image || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      className="h-20 w-28 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedVehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.location}</p>
                      <Badge className="mt-2">Booking #EV2024DEC08</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground">Pickup Date</p>
                      <p className="font-medium">Dec 8, 2025</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">1 Day</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Range</p>
                      <p className="font-medium">{selectedVehicle.range} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Paid</p>
                      <p className="font-medium text-primary">Rs {selectedVehicle.price + 449}</p>
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
                        setIsComplete(false)
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
