import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus } from '../bookings/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Validate booking ID format (should be [accountHash]0[code])
    // Example: 3XSL1GVR01 or 4A2BC3DE0123
    if (typeof bookingId !== 'string' || bookingId.length < 3) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Update the booking status in server storage
    const confirmedAt = new Date().toISOString();
    const updatedBooking = updateBookingStatus(bookingId, 'rented', confirmedAt);

    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      bookingId,
      confirmedAt,
      message: 'Rental confirmed successfully',
    });
  } catch (error) {
    console.error('Error confirming rental:', error);
    return NextResponse.json(
      { error: 'Failed to confirm rental' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return NextResponse.json(
      { error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  // In a real application, you would check the database
  // For now, we'll check localStorage on client side
  return NextResponse.json({
    bookingId,
    message: 'Use POST request to confirm rental',
  });
}
