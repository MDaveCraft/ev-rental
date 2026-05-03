import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.POSTGRES_URL!

// Use a single shared connection across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined
}

const client = global.__pgClient ?? postgres(connectionString, { prepare: false, max: 10 })
if (process.env.NODE_ENV !== "production") {
  global.__pgClient = client
}

export const db = drizzle(client, { schema })
export * from "./schema"
