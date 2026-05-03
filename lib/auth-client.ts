"use client"

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        phone: { type: "string" },
        onboarded: { type: "boolean" },
      },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient
