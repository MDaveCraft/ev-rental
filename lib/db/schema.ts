import { pgTable, text, timestamp, boolean, integer, numeric, uuid, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const roleEnum = pgEnum("user_role", ["renter", "contractor", "admin"])
export const vehicleStatusEnum = pgEnum("vehicle_status", ["available", "rented", "maintenance", "unavailable"])
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
])
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "refunded", "failed"])

// Better Auth core tables (with custom extensions on `user`)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // Custom fields
  role: roleEnum("role").notNull().default("renter"),
  phone: text("phone"),
  onboarded: boolean("onboarded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// App tables
export const vehicle = pgTable("vehicle", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vehicleType: text("vehicle_type").notNull().default("SUV"),
  imageUrl: text("image_url"),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  rangeKm: integer("range_km").notNull(),
  batteryKwh: numeric("battery_kwh", { precision: 5, scale: 1 }).notNull(),
  seats: integer("seats").notNull().default(5),
  location: text("location").notNull(),
  status: vehicleStatusEnum("status").notNull().default("available"),
  description: text("description"),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("4.5"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const booking = pgTable("booking", {
  id: uuid("id").primaryKey().defaultRandom(),
  renterId: text("renter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicle.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  pickupLocation: text("pickup_location").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  ownedVehicles: many(vehicle),
  bookings: many(booking),
}))

export const vehicleRelations = relations(vehicle, ({ one, many }) => ({
  owner: one(user, { fields: [vehicle.ownerId], references: [user.id] }),
  bookings: many(booking),
}))

export const bookingRelations = relations(booking, ({ one }) => ({
  renter: one(user, { fields: [booking.renterId], references: [user.id] }),
  vehicle: one(vehicle, { fields: [booking.vehicleId], references: [vehicle.id] }),
}))

// Inferred types
export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type Vehicle = typeof vehicle.$inferSelect
export type NewVehicle = typeof vehicle.$inferInsert
export type Booking = typeof booking.$inferSelect
export type NewBooking = typeof booking.$inferInsert

export type UserRole = "renter" | "contractor" | "admin"
