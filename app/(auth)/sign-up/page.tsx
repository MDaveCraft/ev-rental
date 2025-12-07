"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, User, ArrowRight, ArrowLeft, Github, Chrome, Linkedin, Loader2, Zap, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth, type UserRole } from "@/lib/auth-context"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, isLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "renter" as UserRole,
    isContractor: false,
  })

  const handleSocialSignUp = async (provider: string) => {
    await signUp(`${provider} User`, `${provider}@example.com`, "renter")
    router.push("/onboarding")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const role = formData.isContractor ? "contractor" : formData.role
    await signUp(formData.name, formData.email, role)
    router.push("/onboarding")
  }

  const roleOptions = [
    {
      value: "renter",
      label: "Renter",
      description: "Book EVs for personal or business trips",
      icon: Car,
    },
    {
      value: "contractor",
      label: "Fleet Partner",
      description: "List your vehicles and earn revenue",
      icon: Zap,
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Left - Illustration (60%) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden w-[60%] overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 lg:block"
      >
        {/* Atmospheric background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[100px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            {/* Fleet Illustration */}
            <div className="relative mb-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <img src="/fleet-of-electric-vehicles-charging-station-night-.jpg" alt="EV Fleet" className="w-full max-w-lg opacity-80" />
              </motion.div>
            </div>

            <h2 className="mb-4 text-3xl font-bold">
              Join the
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                EV Revolution
              </span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Whether you&apos;re renting or listing, our platform makes electric mobility simple and profitable.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 grid gap-4"
          >
            {["AI-powered range prediction", "Smart charging reservations", "V2G revenue opportunities"].map(
              (benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Right - Sign Up Form (40%) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col justify-center px-8 py-12 lg:w-[40%] lg:px-16"
      >
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-xl font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-xl font-semibold">HYMN</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-muted-foreground">Start your sustainable mobility journey</p>
          </motion.div>

          {/* Social Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {[
              { icon: Chrome, label: "Continue with Google", provider: "google" },
              { icon: Github, label: "Continue with GitHub", provider: "github" },
              { icon: Linkedin, label: "Continue with LinkedIn", provider: "linkedin" },
            ].map((social, i) => (
              <motion.div
                key={social.provider}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 bg-transparent"
                  onClick={() => handleSocialSignUp(social.provider)}
                  disabled={isLoading}
                >
                  <social.icon className="h-5 w-5" />
                  {social.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="my-6 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase">or continue with email</span>
            <div className="h-px flex-1 bg-border" />
          </motion.div>

          {/* Email Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Arjun Mehta"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="button" className="w-full gap-2 h-12" onClick={() => setStep(2)}>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <Label>I want to...</Label>
                    {roleOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, role: option.value as UserRole })}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          formData.role === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              formData.role === option.value ? "bg-primary/20" : "bg-secondary"
                            }`}
                          >
                            <option.icon
                              className={`h-5 w-5 ${formData.role === option.value ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {formData.role === "renter" && (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium text-sm">I also want to list my vehicles</p>
                        <p className="text-xs text-muted-foreground">Enable contractor features</p>
                      </div>
                      <Switch
                        checked={formData.isContractor}
                        onCheckedChange={(checked) => setFormData({ ...formData, isContractor: checked })}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button type="submit" className="w-full gap-2 h-12" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-center text-xs text-muted-foreground/60"
          >
            By signing up, you agree to our{" "}
            <Link href="#" className="underline hover:text-muted-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-muted-foreground">
              Privacy Policy
            </Link>
            .
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
