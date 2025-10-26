"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { CheckCircle2, CalendarIcon, Clock, MapPin, Download, Share2, ArrowRight, Sparkles } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import QRCode from "react-qr-code"
import Link from "next/link"
import { useWallet } from "@/components/ConcordiumProvider"
import { useGrpcClient } from "@concordium/react-components"
import { verifyAddressOnChain, getCodeFromContract, waitForTransactionFinalization } from "@/lib/contractInteraction"

const cars = [
  {
    id: "1",
    name: "Tesla Model 3",
    type: "Electric",
    pricePerDay: 89,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "BMW 5 Series",
    type: "Luxury",
    pricePerDay: 120,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Mercedes-Benz GLE",
    type: "SUV",
    pricePerDay: 150,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Audi A4",
    type: "Sedan",
    pricePerDay: 95,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Porsche Cayenne",
    type: "SUV",
    pricePerDay: 180,
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Toyota Camry",
    type: "Sedan",
    pricePerDay: 65,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
  },
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 86400000 * 3))
  const [isBooked, setIsBooked] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  const walletProps = useWallet()
  const grpcClient = useGrpcClient(walletProps.network)
  
  // Get the connection from wallet props
  const connection = walletProps.activeConnector?.getConnections()[0]
  const account = connection ? walletProps.connectedAccounts.get(connection) : undefined

  const car = cars.find((c) => c.id === params.carId)

  useEffect(() => {
    if (!car) {
      router.push("/cars")
    }
  }, [car, router])

  if (!car) return null

  const days = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = days * car.pricePerDay

  const handleBooking = async () => {
    if (!connection || !account || !grpcClient) {
      alert('Please connect your wallet first at /connect-wallet')
      return
    }

    setIsBooking(true)
    
    // Call verify_address on the smart contract
    await verifyAddressOnChain({
      connector: connection,
      account,
      grpcClient,
      onSuccess: async (txHash) => {
        console.log('Transaction submitted, waiting for finalization...');
        
        // Wait for transaction to be finalized
        const isFinalized = await waitForTransactionFinalization(grpcClient, txHash);
        
        if (!isFinalized) {
          alert('Transaction timeout. Please check your wallet and try again.');
          setIsBooking(false);
          return;
        }
        
        console.log('Transaction finalized! Getting code from contract...');
        
        // Get the code from smart contract after finalization
        const code = await getCodeFromContract({
          account,
          grpcClient,
        });
        
        // Format booking ID as BK0[code]
        const newBookingId = code !== null ? `BK0${code}` : `BK${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        setBookingId(newBookingId)
        
        // Save booking to localStorage
        const booking = {
          id: newBookingId,
          carId: car.id,
          carName: car.name,
          carImage: car.image,
          pickupDate: startDate?.toISOString() || '',
          returnDate: endDate?.toISOString() || '',
          location: 'Downtown Center',
          totalPrice,
          status: 'confirmed',
        }
        
        // Get existing bookings
        const existingBookings = JSON.parse(localStorage.getItem('carma_bookings') || '[]')
        // Add new booking
        existingBookings.push(booking)
        // Save back to localStorage
        localStorage.setItem('carma_bookings', JSON.stringify(existingBookings))
        
        setIsBooked(true)
        setIsBooking(false)
      },
      onError: (error) => {
        alert(`Booking failed: ${error}`)
        setIsBooking(false)
      },
      setIsProcessing: () => {}, // We'll handle isBooking state ourselves
    })
  }

  if (isBooked) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="p-8 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30"
              >
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </motion.div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground mb-8">Your {car.name} is ready for pickup</p>

              <div className="bg-muted/30 p-6 rounded-xl mb-6 border border-border/50">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <QRCode 
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/confirm-rental?bookingId=${bookingId}`} 
                      size={200} 
                    />
                  </div>
                </div>
                <p className="text-sm text-foreground font-semibold mb-1">Booking ID: {bookingId}</p>
                <p className="text-xs text-muted-foreground">Scan this QR code at the pickup location to confirm rental</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Pickup Date</span>
                  </div>
                  <p className="text-foreground font-semibold">{startDate?.toLocaleDateString()}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Return Date</span>
                  </div>
                  <p className="text-foreground font-semibold">{endDate?.toLocaleDateString()}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-foreground font-semibold">{days} days</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Pickup Location</span>
                  </div>
                  <p className="text-foreground font-semibold">Downtown Center</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold text-lg">Total Amount</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button className="w-full border-2 border-border text-foreground bg-card/50 hover:bg-primary/10 hover:border-primary">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button className="w-full border-2 border-border text-foreground bg-card/50 hover:bg-primary/10 hover:border-primary">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Booking
                  </Button>
                </motion.div>
              </div>

              <Link href="/bookings">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                    <Sparkles className="mr-2 h-5 w-5" />
                    View All Bookings
                  </Button>
                </motion.div>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-xl">
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
            <Button
              variant="ghost"
              onClick={() => router.push("/cars")}
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              Back to Cars
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Complete Your Booking
          </h1>
          <p className="text-xl text-muted-foreground mb-8">You're one step away from driving your {car.name}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Select Dates</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-foreground mb-2 block font-medium">Pickup Date</Label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-xl border-2 border-border bg-background/50"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block font-medium">Return Date</Label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      className="rounded-xl border-2 border-border bg-background/50"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Pickup Location</h2>
                <div className="space-y-3">
                  <div className="p-5 border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl cursor-pointer hover:border-accent transition-all">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground text-lg">Downtown Center</p>
                        <p className="text-sm text-muted-foreground">123 Main Street, City Center</p>
                        <p className="text-xs text-primary mt-1 font-medium">Open 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 sticky top-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Booking Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                    <p className="font-semibold text-foreground text-lg">{car.name}</p>
                    <p className="text-xs text-muted-foreground">{car.type}</p>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Rate</span>
                      <span className="text-foreground font-medium">${car.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground font-medium">{days} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">${totalPrice}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground text-lg">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleBooking}
                    disabled={!startDate || !endDate || days <= 0 || isBooking}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground h-12 text-base font-semibold shadow-lg shadow-primary/30"
                  >
                    {isBooking ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="flex items-center gap-2 justify-center mt-4 text-xs text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Secured by blockchain technology</span>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
