-- Better Auth + EV rental schema
-- Idempotent: safe to re-run

-- Enums
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

-- Better Auth core tables
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

-- Domain tables
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

-- Realtime publication (idempotent inserts)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE "booking";
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE "vehicle";
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
