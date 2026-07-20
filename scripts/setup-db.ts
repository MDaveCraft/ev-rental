/**
 * Initialize the EV rental + Better Auth schema on Supabase Postgres,
 * then seed demo users (via Better Auth) and vehicles + bookings.
 *
 * Idempotent: safe to re-run.
 */
import "dotenv/config"
import { createClient } from "@supabase/supabase-js"
import { auth } from "../lib/auth"
import { db } from "../lib/db"
import { booking, user, vehicle } from "../lib/db/schema"
import { eq } from "drizzle-orm"

const SCHEMA_SQL = `
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('renter', 'contractor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  role user_role NOT NULL DEFAULT 'renter',
  phone text,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  id text PRIMARY KEY,
  expires_at timestamp NOT NULL,
  token text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "account" (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamp,
  refresh_token_expires_at timestamp,
  scope text,
  password text,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "vehicle" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'SUV',
  image_url text,
  price_per_day numeric(10,2) NOT NULL,
  range_km integer NOT NULL,
  battery_kwh numeric(5,1) NOT NULL,
  seats integer NOT NULL DEFAULT 5,
  location text NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'available',
  description text,
  rating numeric(2,1) DEFAULT 4.5,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "booking" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  renter_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES "vehicle"(id) ON DELETE CASCADE,
  start_date timestamp NOT NULL,
  end_date timestamp NOT NULL,
  total_price numeric(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  pickup_location text NOT NULL,
  notes text,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_owner ON "vehicle"(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_status ON "vehicle"(status);
CREATE INDEX IF NOT EXISTS idx_booking_renter ON "booking"(renter_id);
CREATE INDEX IF NOT EXISTS idx_booking_vehicle ON "booking"(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_booking_status ON "booking"(status);
CREATE INDEX IF NOT EXISTS idx_session_user ON "session"(user_id);
`

const REALTIME_SQL = [
  `ALTER PUBLICATION supabase_realtime ADD TABLE "booking";`,
  `ALTER PUBLICATION supabase_realtime ADD TABLE "vehicle";`,
]

async function ensureSchema() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    console.log("[v0] applying schema…")
    const { error } = await supabase.rpc('exec', { sql: SCHEMA_SQL })
    if (error && !error.message.includes("duplicate")) {
      throw error
    }
    
    for (const stmt of REALTIME_SQL) {
      try {
        await supabase.rpc('exec', { sql: stmt })
      } catch (err: unknown) {
        // Already in publication is fine
        const msg = err instanceof Error ? err.message : String(err)
        if (!msg.includes("already")) {
          console.warn("[v0] realtime publication notice:", msg)
        }
      }
    }
    console.log("[v0] schema OK")
  } finally {
    await sql.end({ timeout: 5 })
  }
}

type Demo = {
  email: string
  password: string
  name: string
  role: "renter" | "contractor" | "admin"
}

const DEMO_USERS: Demo[] = [
  { email: "renter@hymn.ev", password: "Password123!", name: "Riley Renter", role: "renter" },
  { email: "contractor@hymn.ev", password: "Password123!", name: "Casey Contractor", role: "contractor" },
  { email: "admin@hymn.ev", password: "Password123!", name: "Avery Admin", role: "admin" },
]

async function ensureUser(d: Demo): Promise<string> {
  const existing = await db.select().from(user).where(eq(user.email, d.email)).limit(1)
  if (existing.length) {
    // Make sure the role and onboarded flag are correct
    await db
      .update(user)
      .set({ role: d.role, onboarded: true, name: d.name })
      .where(eq(user.id, existing[0]!.id))
    return existing[0]!.id
  }

  const result = await auth.api.signUpEmail({
    body: { email: d.email, password: d.password, name: d.name },
  })
  const newId = (result as { user?: { id?: string } } | undefined)?.user?.id
  if (!newId) throw new Error(`Failed to sign up ${d.email}`)

  await db
    .update(user)
    .set({ role: d.role, onboarded: true, emailVerified: true })
    .where(eq(user.id, newId))

  return newId
}

const VEHICLE_SEEDS = [
  {
    name: "Hymn Voltaic GT",
    make: "Hymn",
    model: "Voltaic GT",
    year: 2024,
    vehicleType: "Sedan",
    imageUrl: "/sleek-electric-sedan.png",
    pricePerDay: "129.00",
    rangeKm: 520,
    batteryKwh: "82.0",
    seats: 5,
    location: "San Francisco, CA",
    description: "Performance EV sedan with all-wheel drive and 0-60 in 3.1s.",
    rating: "4.9",
  },
  {
    name: "Hymn Lumen SUV",
    make: "Hymn",
    model: "Lumen",
    year: 2024,
    vehicleType: "SUV",
    imageUrl: "/electric-suv-charging.png",
    pricePerDay: "149.00",
    rangeKm: 480,
    batteryKwh: "90.0",
    seats: 7,
    location: "San Francisco, CA",
    description: "Family-sized electric SUV with panoramic glass roof.",
    rating: "4.8",
  },
  {
    name: "Hymn Pulse Compact",
    make: "Hymn",
    model: "Pulse",
    year: 2025,
    vehicleType: "Hatchback",
    imageUrl: "/charging-electric-hatchback.png",
    pricePerDay: "89.00",
    rangeKm: 380,
    batteryKwh: "58.0",
    seats: 5,
    location: "Oakland, CA",
    description: "Nimble city EV with quick-charge to 80% in 18 minutes.",
    rating: "4.7",
  },
  {
    name: "Hymn Aero Coupe",
    make: "Hymn",
    model: "Aero",
    year: 2025,
    vehicleType: "Coupe",
    imageUrl: "/sleek-electric-coupe.jpg",
    pricePerDay: "189.00",
    rangeKm: 540,
    batteryKwh: "98.0",
    seats: 4,
    location: "San Jose, CA",
    description: "Aerodynamic flagship coupe with adaptive air suspension.",
    rating: "4.9",
  },
  {
    name: "Hymn Cargo Van",
    make: "Hymn",
    model: "Cargo",
    year: 2024,
    vehicleType: "Van",
    imageUrl: "/electric-cargo-van.jpg",
    pricePerDay: "159.00",
    rangeKm: 320,
    batteryKwh: "120.0",
    seats: 3,
    location: "Berkeley, CA",
    description: "Workhorse cargo van for moves and deliveries.",
    rating: "4.6",
  },
  {
    name: "Hymn Trail Off-roader",
    make: "Hymn",
    model: "Trail",
    year: 2025,
    vehicleType: "SUV",
    imageUrl: "/rugged-electric-off-roader.jpg",
    pricePerDay: "199.00",
    rangeKm: 460,
    batteryKwh: "105.0",
    seats: 5,
    location: "Tahoe, CA",
    description: "Adventure-ready EV with locking diffs and roof tent mounts.",
    rating: "4.8",
  },
]

async function seedVehicles(contractorId: string) {
  const existing = await db.select({ id: vehicle.id }).from(vehicle).limit(1)
  if (existing.length) {
    console.log("[v0] vehicles already seeded, skipping")
    return
  }
  await db.insert(vehicle).values(
    VEHICLE_SEEDS.map((v) => ({
      ...v,
      ownerId: contractorId,
      status: "available" as const,
    })),
  )
  console.log(`[v0] seeded ${VEHICLE_SEEDS.length} vehicles`)
}

async function seedBookings(renterId: string) {
  const existing = await db.select({ id: booking.id }).from(booking).limit(1)
  if (existing.length) {
    console.log("[v0] bookings already seeded, skipping")
    return
  }
  const vehicles = await db.select().from(vehicle).limit(3)
  if (vehicles.length < 2) return
  const now = Date.now()
  const day = 86_400_000
  await db.insert(booking).values([
    {
      renterId,
      vehicleId: vehicles[0]!.id,
      startDate: new Date(now - 7 * day),
      endDate: new Date(now - 4 * day),
      totalPrice: (Number(vehicles[0]!.pricePerDay) * 3).toFixed(2),
      status: "completed",
      paymentStatus: "paid",
      pickupLocation: vehicles[0]!.location,
    },
    {
      renterId,
      vehicleId: vehicles[1]!.id,
      startDate: new Date(now + 2 * day),
      endDate: new Date(now + 5 * day),
      totalPrice: (Number(vehicles[1]!.pricePerDay) * 3).toFixed(2),
      status: "confirmed",
      paymentStatus: "paid",
      pickupLocation: vehicles[1]!.location,
    },
  ])
  console.log("[v0] seeded sample bookings")
}

async function main() {
  await ensureSchema()

  console.log("[v0] seeding users…")
  const ids: Record<Demo["role"], string> = {} as never
  for (const d of DEMO_USERS) {
    ids[d.role] = await ensureUser(d)
    console.log(`  • ${d.email} (${d.role}) -> ${ids[d.role]}`)
  }

  await seedVehicles(ids.contractor)
  await seedBookings(ids.renter)

  console.log("[v0] done.")
  process.exit(0)
}

main().catch((err) => {
  console.error("[v0] init failed:", err)
  process.exit(1)
})
