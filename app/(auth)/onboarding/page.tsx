"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Car,
  Zap,
  Battery,
  Check,
  Loader2,
  Building,
  User,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 4

interface OnboardingData {
  city: string
  useCase: string
  vehiclePreference: string[]
  fleetSize: string
  v2gInterest: boolean
  quizAnswers: string[]
  kycStarted: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, completeOnboarding, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    city: "",
    useCase: "",
    vehiclePreference: [],
    fleetSize: "",
    v2gInterest: false,
    quizAnswers: [],
    kycStarted: false,
  })

  useEffect(() => {
    if (!user) {
      router.push("/sign-in")
    }
  }, [user, router])

  const isContractor = user?.role === "contractor"

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleVehiclePreference = (vehicle: string) => {
    setData((prev) => ({
      ...prev,
      vehiclePreference: prev.vehiclePreference.includes(vehicle)
        ? prev.vehiclePreference.filter((v) => v !== vehicle)
        : [...prev.vehiclePreference, vehicle],
    }))
  }

  const setQuizAnswer = (index: number, answer: string) => {
    const newAnswers = [...data.quizAnswers]
    newAnswers[index] = answer
    setData({ ...data, quizAnswers: newAnswers })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">H</span>
          </div>
          <span className="font-semibold">HYMN</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {TOTAL_STEPS}
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Step 1: Profile Basics */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                  >
                    <User className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="text-2xl font-semibold">Let&apos;s personalize your experience</h1>
                  <p className="mt-2 text-muted-foreground">Tell us a bit about yourself</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Which city are you based in?</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="e.g., Bengaluru"
                        value={data.city}
                        onChange={(e) => setData({ ...data, city: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>What will you primarily use HYMN for?</Label>
                    <RadioGroup value={data.useCase} onValueChange={(value) => setData({ ...data, useCase: value })}>
                      {[
                        { value: "personal", label: "Personal trips", icon: User },
                        { value: "business", label: "Business travel", icon: Building },
                        { value: "both", label: "Both personal and business", icon: Sparkles },
                      ].map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all",
                            data.useCase === option.value ? "border-primary bg-primary/5" : "hover:border-primary/50",
                          )}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <option.icon className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor={option.value} className="cursor-pointer flex-1">
                            {option.label}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Vehicle Preferences (Renter) or Fleet Details (Contractor) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {isContractor ? (
                  <>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
                      >
                        <Car className="h-8 w-8 text-accent" />
                      </motion.div>
                      <h1 className="text-2xl font-semibold">Tell us about your fleet</h1>
                      <p className="mt-2 text-muted-foreground">Help us understand your vehicle inventory</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>How many EVs do you have?</Label>
                        <RadioGroup
                          value={data.fleetSize}
                          onValueChange={(value) => setData({ ...data, fleetSize: value })}
                        >
                          {["1-5", "6-20", "21-50", "50+"].map((size) => (
                            <motion.div
                              key={size}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all",
                                data.fleetSize === size ? "border-primary bg-primary/5" : "hover:border-primary/50",
                              )}
                            >
                              <RadioGroupItem value={size} id={size} />
                              <Label htmlFor={size} className="cursor-pointer flex-1">
                                {size} vehicles
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">Interested in V2G (Vehicle-to-Grid)?</p>
                          <p className="text-sm text-muted-foreground">Earn extra revenue by selling energy back</p>
                        </div>
                        <Switch
                          checked={data.v2gInterest}
                          onCheckedChange={(checked) => setData({ ...data, v2gInterest: checked })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                      >
                        <Car className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h1 className="text-2xl font-semibold">Vehicle preferences</h1>
                      <p className="mt-2 text-muted-foreground">Select the types of EVs you&apos;re interested in</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "hatchback", label: "Hatchback", icon: "🚗" },
                        { value: "sedan", label: "Sedan", icon: "🚙" },
                        { value: "suv", label: "SUV", icon: "🚐" },
                        { value: "luxury", label: "Luxury", icon: "✨" },
                      ].map((vehicle, i) => (
                        <motion.div
                          key={vehicle.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleVehiclePreference(vehicle.value)}
                          className={cn(
                            "cursor-pointer rounded-lg border p-4 text-center transition-all",
                            data.vehiclePreference.includes(vehicle.value)
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50",
                          )}
                        >
                          <div className="text-3xl mb-2">{vehicle.icon}</div>
                          <p className="font-medium">{vehicle.label}</p>
                          {data.vehiclePreference.includes(vehicle.value) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-2 flex justify-center"
                            >
                              <Check className="h-5 w-5 text-primary" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3: EV Knowledge Quiz */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
                  >
                    <Battery className="h-8 w-8 text-accent" />
                  </motion.div>
                  <h1 className="text-2xl font-semibold">Quick EV Assessment</h1>
                  <p className="mt-2 text-muted-foreground">Help us personalize your learning path</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      question: "What does SOC stand for in EV terminology?",
                      options: [
                        "Speed of Charging",
                        "State of Charge",
                        "System on Chip",
                        "Standard Operating Condition",
                      ],
                      correct: 1,
                    },
                    {
                      question: "What is regenerative braking?",
                      options: [
                        "Emergency braking system",
                        "Converting kinetic energy to charge the battery",
                        "A type of brake pad",
                        "Automatic braking feature",
                      ],
                      correct: 1,
                    },
                    {
                      question: "What is V2G technology?",
                      options: [
                        "Vehicle to Garage",
                        "Version 2 Grid",
                        "Vehicle to Grid energy transfer",
                        "Voltage to Ground",
                      ],
                      correct: 2,
                    },
                  ].map((q, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.15 }}
                      className="space-y-3"
                    >
                      <p className="font-medium">
                        {qIndex + 1}. {q.question}
                      </p>
                      <RadioGroup
                        value={data.quizAnswers[qIndex]}
                        onValueChange={(value) => setQuizAnswer(qIndex, value)}
                      >
                        {q.options.map((option, oIndex) => (
                          <motion.div
                            key={oIndex}
                            whileHover={{ scale: 1.01 }}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all text-sm",
                              data.quizAnswers[qIndex] === String(oIndex)
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50",
                            )}
                          >
                            <RadioGroupItem value={String(oIndex)} id={`q${qIndex}-${oIndex}`} />
                            <Label htmlFor={`q${qIndex}-${oIndex}`} className="cursor-pointer flex-1">
                              {option}
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: KYC & Consent */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                  >
                    <Zap className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="text-2xl font-semibold">Almost there!</h1>
                  <p className="mt-2 text-muted-foreground">Complete verification to unlock all features</p>
                </div>

                <div className="space-y-4">
                  {data.kycStarted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
                      >
                        <Check className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold">KYC Initiated</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We&apos;ll notify you once verification is complete
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-6 flex-col gap-2 bg-transparent"
                        onClick={() => setData({ ...data, kycStarted: true })}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          <span className="font-medium">Start KYC Verification</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Driver&apos;s License & Aadhaar verification
                        </span>
                      </Button>
                    </motion.div>
                  )}

                  <div className="rounded-lg border p-4 space-y-3">
                    <p className="text-sm font-medium">By continuing, you agree to:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {["Terms of Service", "Privacy Policy", "Data Processing Agreement"].map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-primary" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex gap-3"
          >
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button onClick={handleNext} className="w-full gap-2 h-12" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentStep === TOTAL_STEPS ? (
                  <>
                    Get Started
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
