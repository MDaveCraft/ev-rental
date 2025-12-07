import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "HYMN EV Rentals",
  description: "Asset-light EV aggregation with AI range & health assurance",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <Suspense fallback={null}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
              <Analytics />
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
