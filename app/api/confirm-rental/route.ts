import { NextRequest, NextResponse } from 'next/server';

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

    // Log the confirmation (in production, this would update a database)
    console.log('Rental confirmed for booking:', bookingId);

    // Return success response
    return NextResponse.json({
      success: true,
      bookingId,
      confirmedAt: new Date().toISOString(),
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
