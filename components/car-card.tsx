"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Gauge, Star, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface Car {
  id: string
  name: string
  type: string
  image: string
  pricePerDay: number
  features: string[]
  seats: number
  transmission: string
}

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const router = useRouter()

  const handleBook = () => {
    router.push(`/booking/${car.id}`)
  }

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={car.image || "/placeholder.svg"}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          {car.type}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {car.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">4.8</span>
            <span>(120 reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span className="font-medium">{car.transmission}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {car.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border/50"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              €{car.pricePerDay}
            </p>
            <p className="text-sm text-muted-foreground">per day</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBook}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30 transition-all"
            >
              Book Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  )
}
