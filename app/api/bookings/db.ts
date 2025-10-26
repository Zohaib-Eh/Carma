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
  account?: string
  rentedAt?: string
}

// In-memory storage (persists across requests, resets on server restart)
let bookings: Booking[] = []

export function getBookings(): Booking[] {
  return bookings
}

export function getBookingsByAccount(account: string): Booking[] {
  return bookings.filter(b => b.account === account)
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find(b => b.id === id)
}

export function addBooking(booking: Booking): Booking {
  bookings.push(booking)
  return booking
}

export function updateBookingStatus(id: string, status: string, rentedAt?: string): Booking | null {
  const booking = bookings.find(b => b.id === id)
  if (booking) {
    booking.status = status
    if (rentedAt) {
      booking.rentedAt = rentedAt
    }
    return booking
  }
  return null
}
