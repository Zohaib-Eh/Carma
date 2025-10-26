"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Sparkles } from "lucide-react"
import Link from "next/link"

const cars = [
  {
    id: "1",
    name: "Tesla Model 3",
    type: "Electric",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    pricePerDay: 89,
    features: ["Autopilot", "Long Range", "Premium Interior"],
    seats: 5,
    transmission: "Automatic",
  },
  {
    id: "2",
    name: "BMW 5 Series",
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
    pricePerDay: 120,
    features: ["Leather Seats", "Navigation", "Sunroof"],
    seats: 5,
    transmission: "Automatic",
  },
  {
    id: "3",
    name: "Mercedes-Benz GLE",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop",
    pricePerDay: 150,
    features: ["4MATIC", "Premium Sound", "Panoramic Roof"],
    seats: 7,
    transmission: "Automatic",
  },
  {
    id: "4",
    name: "Audi A4",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
    pricePerDay: 95,
    features: ["Quattro AWD", "Virtual Cockpit", "LED Lights"],
    seats: 5,
    transmission: "Automatic",
  },
  {
    id: "5",
    name: "Porsche Cayenne",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&auto=format&fit=crop",
    pricePerDay: 180,
    features: ["Sport Chrono", "Air Suspension", "Premium Audio"],
    seats: 5,
    transmission: "Automatic",
  },
  {
    id: "6",
    name: "Toyota Camry",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
    pricePerDay: 65,
    features: ["Hybrid", "Safety Sense", "Apple CarPlay"],
    seats: 5,
    transmission: "Automatic",
  },
]

export default function CarsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || car.type === selectedType
    return matchesSearch && matchesType
  })

  const carTypes = Array.from(new Set(cars.map((car) => car.type)))

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

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
            <Link href="/bookings">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30">
                  <Sparkles className="mr-2 h-4 w-4" />
                  My Bookings
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Choose Your Ride
          </h1>
          <p className="text-xl text-muted-foreground">Select from our premium collection of vehicles</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for a car..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card/50 backdrop-blur-sm border-border text-foreground h-14 focus:border-primary transition-all"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="border-2 border-primary/50 text-foreground h-14 px-6 bg-card/50 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all">
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </motion.div>
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedType === null ? "default" : "outline"}
                onClick={() => setSelectedType(null)}
                className={
                  selectedType === null
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                    : "border-2 border-border text-foreground hover:bg-primary/10 hover:border-primary bg-card/50 backdrop-blur-sm"
                }
              >
                All
              </Button>
            </motion.div>
            {carTypes.map((type) => (
              <motion.div key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className={
                    selectedType === type
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                      : "border-2 border-border text-foreground hover:bg-primary/10 hover:border-primary bg-card/50 backdrop-blur-sm"
                  }
                >
                  {type}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cars grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No cars found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
