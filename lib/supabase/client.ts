"use client"

import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

let cached: SupabaseClient | null = null

/**
 * Browser Supabase client used purely for Realtime subscriptions.
 * Authentication is handled by Better Auth, not by Supabase Auth.
 */
export function createClient(): SupabaseClient {
  if (cached) return cached
  cached = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 5 } },
    },
  )
  return cached
}
