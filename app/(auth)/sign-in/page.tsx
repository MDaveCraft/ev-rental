"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Github, Chrome, Linkedin, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function SignInPage() {
  const router = useRouter()
  const { signIn, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const handleSocialSignIn = async (provider: string) => {
    // Mock social sign-in - use demo accounts
    const demoEmails: Record<string, string> = {
      google: "renter@hymn.ev",
      github: "contractor@hymn.ev",
      linkedin: "admin@hymn.ev",
    }
    await signIn(demoEmails[provider] || "renter@hymn.ev")
    router.push("/dashboard")
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showOTP) {
      setShowOTP(true)
      return
    }
    // Verify OTP and sign in
    await signIn(email)
    router.push("/dashboard")
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Illustration (60%) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden w-[60%] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 lg:block"
      >
        {/* Atmospheric background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glowing orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
          />
        </div>

        {/* EV Illustration */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            {/* EV Car Illustration */}
            <div className="relative mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <img src="/futuristic-electric-car-side-view-silhouette-glowi.jpg" alt="EV Car" className="w-full max-w-lg opacity-80" />
              </motion.div>

              {/* Charging effect */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2"
              >
                <Zap className="h-6 w-6 text-primary" />
                <div className="h-2 w-32 overflow-hidden rounded-full bg-primary/20">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              </motion.div>
            </div>

            <h2 className="mb-4 text-3xl font-bold">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EV Mobility</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Join thousands of users experiencing seamless electric vehicle rentals with AI-powered range assurance.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 flex gap-12"
          >
            {[
              { value: "2,847", label: "Active EVs" },
              { value: "92%", label: "Range Accuracy" },
              { value: "50K+", label: "Happy Renters" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right - Sign In Form (40%) */}
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
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue your EV journey</p>
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
                  onClick={() => handleSocialSignIn(social.provider)}
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
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >
            {!showOTP ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to <span className="text-foreground font-medium">{email}</span>
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <Input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(i, e.target.value)}
                      className="h-12 w-12 text-center text-lg font-semibold"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="w-full text-center text-sm text-primary hover:underline"
                >
                  Use a different email
                </button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full gap-2 h-12" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {showOTP ? "Verify & Sign In" : "Continue with Email"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-center text-xs text-muted-foreground/60"
          >
            Our AI intern is charging; meanwhile check our{" "}
            <Link href="#" className="underline hover:text-muted-foreground">
              privacy policy
            </Link>
            .
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
