"use server"

import { revalidatePath } from "next/cache"
import { eq, desc, and, or, gte, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { booking, vehicle, user, type Booking, type Vehicle } from "@/lib/db/schema"
import { requireUser, requireRole } from "@/lib/auth-helpers"

export type BookingWithVehicle = Booking & { vehicle: Vehicle }

export async function listAvailableVehicles(): Promise<Vehicle[]> {
  return db.select().from(vehicle).where(eq(vehicle.status, "available")).orderBy(desc(vehicle.createdAt))
}

export async function listAllVehicles(): Promise<Vehicle[]> {
  return db.select().from(vehicle).orderBy(desc(vehicle.createdAt))
}

export async function listMyBookings(): Promise<BookingWithVehicle[]> {
  const session = await requireUser()
  const rows = await db
    .select({ booking, vehicle })
    .from(booking)
    .innerJoin(vehicle, eq(booking.vehicleId, vehicle.id))
    .where(eq(booking.renterId, session.user.id))
    .orderBy(desc(booking.createdAt))

  return rows.map((r) => ({ ...r.booking, vehicle: r.vehicle }))
}

export async function listFleetBookings(): Promise<BookingWithVehicle[]> {
  // Contractors see bookings on their vehicles only
  const session = await requireRole(["contractor", "admin"])
  const role = (session.user as { role?: string }).role

  const baseQuery = db
    .select({ booking, vehicle })
    .from(booking)
    .innerJoin(vehicle, eq(booking.vehicleId, vehicle.id))
    .orderBy(desc(booking.createdAt))

  const rows =
    role === "admin"
      ? await baseQuery
      : await baseQuery.where(eq(vehicle.ownerId, session.user.id))

  return rows.map((r) => ({ ...r.booking, vehicle: r.vehicle }))
}

export type CreateBookingInput = {
  vehicleId: string
  startDate: string // ISO
  endDate: string // ISO
  pickupLocation: string
  notes?: string
}

export async function createBooking(input: CreateBookingInput) {
  const session = await requireUser()

  if (!input.vehicleId) throw new Error("vehicleId is required")
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid dates")
  }
  if (end <= start) throw new Error("End date must be after start date")

  // Look up vehicle to compute price
  const v = await db.select().from(vehicle).where(eq(vehicle.id, input.vehicleId))
  if (v.length === 0) throw new Error("Vehicle not found")
  if (v[0].status !== "available") throw new Error("Vehicle is not available")

  // Check for overlapping confirmed/active bookings
  const conflicts = await db
    .select({ id: booking.id })
    .from(booking)
    .where(
      and(
        eq(booking.vehicleId, input.vehicleId),
        or(eq(booking.status, "confirmed"), eq(booking.status, "active"), eq(booking.status, "pending")),
        // Overlap: existing.start <= new.end AND existing.end >= new.start
        lte(booking.startDate, end),
        gte(booking.endDate, start),
      ),
    )
  if (conflicts.length > 0) throw new Error("Vehicle is already booked for those dates")

  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const totalPrice = (days * Number(v[0].pricePerDay)).toFixed(2)

  const inserted = await db
    .insert(booking)
    .values({
      renterId: session.user.id,
      vehicleId: input.vehicleId,
      startDate: start,
      endDate: end,
      totalPrice,
      pickupLocation: input.pickupLocation || v[0].location,
      notes: input.notes,
      status: "confirmed",
      paymentStatus: "paid",
    })
    .returning()

  revalidatePath("/dashboard/bookings")
  return inserted[0]
}

export async function cancelBooking(bookingId: string) {
  const session = await requireUser()
  const role = (session.user as { role?: string }).role ?? "renter"

  const rows = await db.select().from(booking).where(eq(booking.id, bookingId))
  if (rows.length === 0) throw new Error("Booking not found")

  const b = rows[0]
  if (role !== "admin" && b.renterId !== session.user.id) {
    throw new Error("Not authorized")
  }
  if (b.status === "completed" || b.status === "cancelled") {
    throw new Error(`Cannot cancel a ${b.status} booking`)
  }

  await db
    .update(booking)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(booking.id, bookingId))

  revalidatePath("/dashboard/bookings")
}

export async function getRenterStats() {
  const session = await requireUser()
  const all = await db.select().from(booking).where(eq(booking.renterId, session.user.id))
  return {
    total: all.length,
    active: all.filter((b) => b.status === "active").length,
    upcoming: all.filter((b) => b.status === "confirmed").length,
    completed: all.filter((b) => b.status === "completed").length,
  }
}

export type UserSummary = { id: string; name: string; email: string; role: string }

export async function getCurrentUser(): Promise<UserSummary | null> {
  const session = await requireUser()
  const rows = await db.select().from(user).where(eq(user.id, session.user.id))
  if (rows.length === 0) return null
  const u = rows[0]
  return { id: u.id, name: u.name, email: u.email, role: u.role }
}
