"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth-helpers"

export async function completeOnboardingAction(payload: { phone?: string }) {
  const session = await requireUser()
  await db
    .update(user)
    .set({ onboarded: true, phone: payload.phone, updatedAt: new Date() })
    .where(eq(user.id, session.user.id))
  revalidatePath("/dashboard")
}
