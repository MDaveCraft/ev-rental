"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

/**
 * Subscribes to Postgres changes on the `booking` and `vehicle` tables and
 * triggers a router refresh whenever something changes, so server components
 * re-fetch fresh data.
 */
export function useRealtimeBookings() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("realtime:bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "booking" }, () => {
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "vehicle" }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])
}
