import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ConcordiumProvider } from "@/components/ConcordiumProvider"
import "@/lib/bigint-polyfill"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Carma - Blockchain Car Rentals",
  description: "Simplify car rentals through blockchain-based license verification",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        <ConcordiumProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConcordiumProvider>
        <Analytics />
      </body>
    </html>
  )
}
