import { NextResponse } from "next/server"
import { getBookings, addBooking } from "./db"

export async function GET() {
  return NextResponse.json(getBookings())
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
