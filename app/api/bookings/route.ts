import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "bookings.json");

async function readBookings() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: any[]) {
  await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), "utf-8");
}

export async function GET() {
  const bookings = await readBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const newBooking = await req.json();
  const bookings = await readBookings();
  bookings.push(newBooking);
  await saveBookings(bookings);
  return NextResponse.json({ success: true, id: newBooking.id });
}
