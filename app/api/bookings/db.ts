export interface Booking {
  id: string
  carId: string
  carName: string
  carImage: string
  pickupDate: string
  returnDate: string
  location: string
  totalPrice: number
  status: string
  account: string
  createdAt: string
}

// Singleton array to store bookings in memory
let bookings: Booking[] = []

export function getBookings(): Booking[] {
  return bookings
}

export function addBooking(booking: Booking): Booking {
  bookings.push(booking)
  return booking
}
