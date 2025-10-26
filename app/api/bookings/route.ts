import { NextRequest, NextResponse } from "next/server"
import { getBookings, addBooking, getBookingsByAccount } from "./db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const account = searchParams.get('account')
  
  const bookings = account ? getBookingsByAccount(account) : getBookings()
  return NextResponse.json(bookings)
}

export async function POST(req: Request) {
  try {
    const booking = await req.json()
    addBooking(booking)
    return NextResponse.json({ success: true, id: booking.id })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid booking data" }, { status: 400 })
  }
}
