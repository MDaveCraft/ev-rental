"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export type UserRole = "renter" | "contractor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  onboarded: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password?: string) => Promise<void>
  signUp: (name: string, email: string, role: UserRole) => Promise<void>
  signOut: () => void
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  "renter@hymn.ev": {
    id: "1",
    name: "Arjun Mehta",
    email: "renter@hymn.ev",
    role: "renter",
    avatar: "/indian-professional-man.png",
    onboarded: true,
  },
  "contractor@hymn.ev": {
    id: "2",
    name: "Priya Sharma",
    email: "contractor@hymn.ev",
    role: "contractor",
    avatar: "/indian-woman-professional.png",
    onboarded: true,
  },
  "admin@hymn.ev": {
    id: "3",
    name: "Vikram Singh",
    email: "admin@hymn.ev",
    role: "admin",
    avatar: "/indian-man-executive.jpg",
    onboarded: true,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = useCallback(async (email: string, _password?: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    const mockUser = MOCK_USERS[email.toLowerCase()] || {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      role: "renter" as UserRole,
      onboarded: false,
    }
    setUser(mockUser)
    setIsLoading(false)
  }, [])

  const signUp = useCallback(async (name: string, email: string, role: UserRole) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setUser({
      id: Date.now().toString(),
      name,
      email,
      role,
      onboarded: false,
    })
    setIsLoading(false)
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
  }, [])

  const completeOnboarding = useCallback(() => {
    if (user) {
      setUser({ ...user, onboarded: true })
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
