"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Sparkles, QrCode, Car, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import QRCode from "react-qr-code"
import { useWallet } from "@/components/ConcordiumProvider"

interface Booking {
  id: string
  carId: string
  carName: string
  carImage: string
  pickupDate: string
  returnDate: string
  location: string
  totalPrice: number
  status: string
}

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const walletProps = useWallet()
  const connection = walletProps.activeConnector?.getConnections()[0]
  const account = connection ? walletProps.connectedAccounts.get(connection) : undefined

  const fetchBookings = async () => {
    if (!account) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/bookings?account=${account}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchBookings()
    }, 3000)

    return () => clearInterval(interval)
  }, [account])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/50">
                  <span className="text-primary-foreground font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Carma
                </span>
              </div>
            </Link>
            <Link href="/cars">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Browse Cars
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-muted-foreground">View and manage your car rental bookings</p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30"
              >
                <Car className="w-12 h-12 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-3">No Bookings Yet</h2>
              <p className="text-muted-foreground text-lg mb-8">
                You haven't made any car reservations. Start exploring our amazing fleet!
              </p>
              <Link href="/cars">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Browse Cars
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={booking.carImage || "/placeholder.svg"}
                    alt={booking.carName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className={`absolute top-4 right-4 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg capitalize flex items-center gap-2 ${
                    booking.status === 'rented' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}>
                    {booking.status === 'rented' && <CheckCircle2 className="w-4 h-4" />}
                    {booking.status}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{booking.carName}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Booking ID: {booking.id}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-muted-foreground">Pickup - Return</p>
                        <p className="text-foreground font-medium">
                          {new Date(booking.pickupDate).toLocaleDateString()} -{" "}
                          {new Date(booking.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="text-foreground font-medium">{booking.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        €{booking.totalPrice}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30"
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        {selectedBooking === booking.id ? "Hide QR" : "Show QR"}
                      </Button>
                    </motion.div>
                  </div>

                  {/* QR Code Section */}
                  {selectedBooking === booking.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-border/50"
                    >
                      {booking.status === 'rented' ? (
                        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 p-6 rounded-xl flex flex-col items-center gap-4">
                          <CheckCircle2 className="w-16 h-16 text-green-500" />
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600 mb-1">Vehicle Rented</p>
                            <p className="text-sm text-muted-foreground">This booking has been confirmed and the vehicle is in use</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-4">
                          <QRCode
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/confirm-rental?bookingId=${booking.id}`}
                            size={200}
                          />
                          <div className="text-center">
                            <p className="text-sm text-gray-900 font-medium mb-1">Scan to confirm rental pickup</p>
                            <p className="text-xs text-gray-600">This QR code will mark the vehicle as rented</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
