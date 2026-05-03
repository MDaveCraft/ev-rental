"use client"

/**
 * Compatibility shim: existing components import `useAuth` from this module.
 * Under the hood we now use Better Auth's session, so all dashboards/components
 * keep working without modification.
 */

import type React from "react"
import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { completeOnboardingAction } from "@/lib/actions/user"

export type UserRole = "renter" | "contractor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  onboarded: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Better Auth's useSession works without a provider, but we keep this
  // component so existing layout code doesn't break.
  return <>{children}</>
}

export function useAuth() {
  const router = useRouter()
  const { data, isPending } = useSession()

  const user = useMemo<User | null>(() => {
    if (!data?.user) return null
    const u = data.user as typeof data.user & {
      role?: UserRole
      onboarded?: boolean
      image?: string | null
    }
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.role as UserRole) ?? "renter",
      avatar: u.image ?? undefined,
      onboarded: u.onboarded ?? false,
    }
  }, [data])

  const signIn = useCallback(async (email: string, password?: string) => {
    if (!password) throw new Error("Password is required")
    const res = await authClient.signIn.email({ email, password })
    if (res.error) throw new Error(res.error.message ?? "Sign in failed")
    return res
  }, [])

  const signUp = useCallback(async (name: string, email: string, role: UserRole, password?: string) => {
    if (!password) throw new Error("Password is required")
    const res = await authClient.signUp.email({
      email,
      password,
      name,
      // additional fields
      // @ts-expect-error - additionalFields are typed via inferAdditionalFields
      role,
    })
    if (res.error) throw new Error(res.error.message ?? "Sign up failed")
    return res
  }, [])

  const signOut = useCallback(async () => {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }, [router])

  const completeOnboarding = useCallback(async () => {
    await completeOnboardingAction({})
    router.refresh()
  }, [router])

  return {
    user,
    isLoading: isPending,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
  }
}
