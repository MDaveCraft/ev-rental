/**
 * One-shot script that:
 *  1. Creates all required tables / enums on Supabase Postgres
 *  2. Adds vehicle/booking to the `supabase_realtime` publication
 *  3. Seeds 3 demo users (renter, contractor, admin) via Better Auth
 *  4. Seeds vehicles + sample bookings
 *
 * Run with:  bun scripts/init.ts
 */

import postgres from "postgres"
import { eq } from "drizzle-orm"
import { auth } from "../lib/auth"
import { db } from "../lib/db"
import { user, vehicle, booking } from "../lib/db/schema"
import type { UserRole } from "../lib/db/schema"

const CONNECTION_STRING = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL

if (!CONNECTION_STRING) {
  console.error("Missing POSTGRES_URL / POSTGRES_URL_NON_POOLING")
  process.exit(1)
}

async function setupSchema() {
  const sql = postgres(CONNECTION_STRING!, { prepare: false, max: 1 })

  console.log("Creating enums...")
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('renter', 'contractor', 'admin');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  console.log("Creating tables...")
  await sql.unsafe(`
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
  `)
  await sql.unsafe(`
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
  `)
  await sql.unsafe(`
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
  `)
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "verification" (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamp NOT NULL,
      created_at timestamp NOT NULL DEFAULT NOW(),
      updated_at timestamp NOT NULL DEFAULT NOW()
    );
  `)
  await sql.unsafe(`
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
  `)
  await sql.unsafe(`
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
  `)

  // Helpful indexes
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_vehicle_owner ON "vehicle"(owner_id);`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_vehicle_status ON "vehicle"(status);`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_booking_renter ON "booking"(renter_id);`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_booking_vehicle ON "booking"(vehicle_id);`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_booking_status ON "booking"(status);`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_session_user ON "session"(user_id);`)

  console.log("Enabling realtime publication...")
  for (const tbl of ["booking", "vehicle"]) {
    try {
      await sql.unsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "${tbl}";`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!msg.includes("already member")) {
        console.warn(`Could not add ${tbl} to publication:`, msg)
      }
    }
  }

  await sql.end()
}

async function ensureUser(
  email: string,
  name: string,
  password: string,
  role: UserRole,
): Promise<string> {
  const existing = await db.select().from(user).where(eq(user.email, email))
  if (existing.length > 0) {
    console.log(`  - ${email} exists, ensuring role=${role}`)
    await db
      .update(user)
      .set({ role, onboarded: true, name, updatedAt: new Date() })
      .where(eq(user.email, email))
    return existing[0].id
  }

  console.log(`  - Creating ${email} (${role})`)
  await auth.api.signUpEmail({
    body: { email, password, name },
  })

  // Set role + onboarded directly (we don't expose role on sign-up form)
  await db
    .update(user)
    .set({ role, onboarded: true, updatedAt: new Date() })
    .where(eq(user.email, email))

  const created = await db.select().from(user).where(eq(user.email, email))
  return created[0].id
}

async function seedVehicles(contractorId: string): Promise<string[]> {
  console.log("Clearing existing bookings + vehicles...")
  await db.delete(booking)
  await db.delete(vehicle)

  console.log("Inserting vehicles...")
  const seeds = [
    {
      ownerId: contractorId,
      name: "Tata Nexon EV Max",
      make: "Tata",
      model: "Nexon EV Max",
      year: 2024,
      vehicleType: "SUV",
      imageUrl: "/tata-nexon-ev-max-side-view.jpg",
      pricePerDay: "2499",
      rangeKm: 437,
      batteryKwh: "40.5",
      seats: 5,
      location: "Koramangala, Bengaluru",
      description: "Long-range electric SUV with fast charging support.",
      rating: "4.8",
    },
    {
      ownerId: contractorId,
      name: "MG ZS EV",
      make: "MG",
      model: "ZS EV",
      year: 2024,
      vehicleType: "SUV",
      imageUrl: "/mg-zs-ev-side-profile.jpg",
      pricePerDay: "2899",
      rangeKm: 461,
      batteryKwh: "50.3",
      seats: 5,
      location: "Indiranagar, Bengaluru",
      description: "Premium electric SUV with advanced safety features.",
      rating: "4.7",
    },
    {
      ownerId: contractorId,
      name: "Tata Tigor EV",
      make: "Tata",
      model: "Tigor EV",
      year: 2023,
      vehicleType: "Sedan",
      imageUrl: "/tata-tigor-ev-compact-sedan.jpg",
      pricePerDay: "1799",
      rangeKm: 315,
      batteryKwh: "26.0",
      seats: 5,
      location: "HSR Layout, Bengaluru",
      description: "Compact electric sedan, perfect for city commutes.",
      rating: "4.6",
    },
    {
      ownerId: contractorId,
      name: "Mahindra XUV400",
      make: "Mahindra",
      model: "XUV400",
      year: 2024,
      vehicleType: "SUV",
      imageUrl: "/mahindra-xuv400-electric-suv.jpg",
      pricePerDay: "2699",
      rangeKm: 456,
      batteryKwh: "39.4",
      seats: 5,
      location: "Whitefield, Bengaluru",
      description: "Spacious electric SUV with strong performance.",
      rating: "4.5",
    },
    {
      ownerId: contractorId,
      name: "Hyundai Kona Electric",
      make: "Hyundai",
      model: "Kona Electric",
      year: 2024,
      vehicleType: "SUV",
      imageUrl: "/futuristic-electric-car-side-view-silhouette-glowi.jpg",
      pricePerDay: "3499",
      rangeKm: 452,
      batteryKwh: "39.2",
      seats: 5,
      location: "JP Nagar, Bengaluru",
      description: "Premium imported electric crossover.",
      rating: "4.7",
    },
    {
      ownerId: contractorId,
      name: "BYD Atto 3",
      make: "BYD",
      model: "Atto 3",
      year: 2024,
      vehicleType: "SUV",
      imageUrl: "/fleet-of-electric-vehicles-charging-station-night-.jpg",
      pricePerDay: "3999",
      rangeKm: 521,
      batteryKwh: "60.5",
      seats: 5,
      location: "MG Road, Bengaluru",
      description: "Long-range premium SUV with blade battery.",
      rating: "4.8",
    },
  ]

  const inserted = await db.insert(vehicle).values(seeds).returning({ id: vehicle.id })
  return inserted.map((v) => v.id)
}

async function seedBookings(renterId: string, vehicleIds: string[]) {
  if (vehicleIds.length === 0) return
  console.log("Inserting sample bookings...")

  const now = new Date()
  const day = (offset: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + offset)
    d.setHours(9, 0, 0, 0)
    return d
  }

  await db.insert(booking).values([
    {
      renterId,
      vehicleId: vehicleIds[0],
      startDate: day(-7),
      endDate: day(-5),
      totalPrice: "4998",
      status: "completed",
      paymentStatus: "paid",
      pickupLocation: "Koramangala, Bengaluru",
      notes: "Weekend trip to Mysuru",
    },
    {
      renterId,
      vehicleId: vehicleIds[1],
      startDate: day(-1),
      endDate: day(2),
      totalPrice: "8697",
      status: "active",
      paymentStatus: "paid",
      pickupLocation: "Indiranagar, Bengaluru",
    },
    {
      renterId,
      vehicleId: vehicleIds[2],
      startDate: day(5),
      endDate: day(7),
      totalPrice: "3598",
      status: "confirmed",
      paymentStatus: "paid",
      pickupLocation: "HSR Layout, Bengaluru",
      notes: "Airport pickup",
    },
  ])
}

async function main() {
  console.log("== Setting up schema ==")
  await setupSchema()

  console.log("\n== Seeding users ==")
  const renterId = await ensureUser("renter@hymn.ev", "Arjun Mehta", "Password123!", "renter")
  const contractorId = await ensureUser(
    "contractor@hymn.ev",
    "Priya Sharma",
    "Password123!",
    "contractor",
  )
  await ensureUser("admin@hymn.ev", "Vikram Singh", "Password123!", "admin")

  console.log("\n== Seeding vehicles ==")
  const vehicleIds = await seedVehicles(contractorId)

  console.log("\n== Seeding bookings ==")
  await seedBookings(renterId, vehicleIds)

  console.log("\nDone. Demo accounts (password: Password123!):")
  console.log("  renter@hymn.ev / contractor@hymn.ev / admin@hymn.ev")
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
