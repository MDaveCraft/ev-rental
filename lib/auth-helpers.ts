import "server-only"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import type { UserRole } from "@/lib/db/schema"

export const getServerSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

export async function requireUser() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/sign-in")
  }
  return session
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireUser()
  const role = (session.user as { role?: UserRole }).role ?? "renter"
  if (!roles.includes(role)) {
    redirect("/dashboard")
  }
  return session
}

export async function requireOnboarded() {
  const session = await requireUser()
  const onboarded = (session.user as { onboarded?: boolean }).onboarded ?? false
  if (!onboarded) {
    redirect("/onboarding")
  }
  return session
}
