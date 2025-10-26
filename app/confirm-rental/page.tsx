"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, Car, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ConfirmRentalPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const bookingId = searchParams.get('bookingId')

  useEffect(() => {
    if (!bookingId) {
      setStatus('error')
      setMessage('Invalid QR code - no booking ID found')
      return
    }

    // Call API to confirm rental
    confirmRental(bookingId)
  }, [bookingId])

  const confirmRental = async (bookingId: string) => {
    try {
      const response = await fetch('/api/confirm-rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update booking status in localStorage
        const bookings = JSON.parse(localStorage.getItem('carma_bookings') || '[]')
        const updatedBookings = bookings.map((booking: any) => {
          if (booking.id === bookingId) {
            return { ...booking, status: 'rented', rentedAt: data.confirmedAt }
          }
          return booking
        })
        localStorage.setItem('carma_bookings', JSON.stringify(updatedBookings))

        setStatus('success')
        setMessage('Rental confirmed! Vehicle is now active.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to confirm rental')
      }
    } catch (error) {
      console.error('Error confirming rental:', error)
      setStatus('error')
      setMessage('Failed to connect to server')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl text-center">
            {status === 'loading' && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-6"
                >
                  <Loader2 className="w-24 h-24 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Confirming Rental...
                </h1>
                <p className="text-muted-foreground">Please wait while we process your request</p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">
                  Rental Confirmed!
                </h1>
                <p className="text-muted-foreground mb-2">Booking ID: {bookingId}</p>
                <p className="text-foreground mb-8">{message}</p>

                <div className="space-y-3">
                  <Link href="/bookings">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                        <Car className="mr-2 h-5 w-5" />
                        View My Bookings
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30"
                >
                  <XCircle className="w-12 h-12 text-red-500" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                  Confirmation Failed
                </h1>
                <p className="text-foreground mb-8">{message}</p>

                <div className="space-y-3">
                  <Link href="/bookings">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                        View My Bookings
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
