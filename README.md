# Carma - Blockchain Car Rental Platform

A decentralized car rental platform built with Next.js 16 and integrated with Concordium blockchain.

## Features

### 🔐 Blockchain Integration
- **Wallet Connection**: Connect using Concordium Browser Wallet or WalletConnect
- **Identity Verification**: ZK-proof based age verification (18+) and driving license validation
- **Smart Contract**: Verify addresses on-chain (Contract Index: 12282)
- **Booking Codes**: Generate unique booking codes from blockchain

### 🚗 Car Rental System
- Browse available vehicles with real-time pricing
- Date-based booking system
- QR code generation for rental confirmation
- Booking management dashboard

### 📱 QR Code Rental Confirmation
When a booking is made, a QR code is generated that contains a URL to confirm the rental:

1. **Booking Confirmed**: User receives QR code with booking details
2. **Scan at Pickup**: Staff scans QR code at pickup location
3. **API Call**: QR code triggers `/api/confirm-rental` endpoint
4. **Status Update**: Booking status changes from "confirmed" to "rented"
5. **Visual Indicator**: Green checkmark badge appears on booking card

### 🎨 Design
- Modern gradient UI with glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Dark mode support

## Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Blockchain**: 
  - @concordium/react-components v0.6.1
  - @concordium/web-sdk v7.5.1
  - @concordium/wallet-connectors
- **Animations**: Framer Motion
- **QR Codes**: react-qr-code

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## QR Code Flow

When a user completes a booking:
1. Smart contract `verify_address()` is called
2. Transaction is finalized on blockchain
3. `get_code()` retrieves unique verification code
4. Booking ID is formatted as `BK0[code]`
5. QR code is generated with URL: `/confirm-rental?bookingId=BK0XXX`

When QR code is scanned:
1. Opens `/confirm-rental` page with booking ID
2. Calls `POST /api/confirm-rental` with booking ID
3. Updates booking status to "rented" in localStorage
4. Shows green success indicator

## API Endpoints

### POST /api/confirm-rental
Confirms a rental when QR code is scanned.

**Request:**
```json
{
  "bookingId": "BK0123"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "BK0123",
  "confirmedAt": "2025-10-26T12:00:00.000Z",
  "message": "Rental confirmed successfully"
}
```

## Smart Contract (Concordium)

- **Contract Index**: 12282
- **Network**: Testnet
- **Functions**:
  - `verify_address()`: Verifies user's wallet address
  - `get_code()`: Returns verification code for user

## Project Structure

```
v0-ui/
├── app/
│   ├── api/
│   │   └── confirm-rental/     # API endpoint for QR code confirmation
│   ├── booking/[carId]/        # Individual car booking page
│   ├── bookings/               # View all bookings
│   ├── cars/                   # Browse cars
│   ├── connect-wallet/         # Wallet connection
│   ├── confirm-rental/         # QR code scan confirmation page
│   └── verify/                 # Identity verification
├── components/
│   ├── ConcordiumProvider.tsx  # Wallet context provider
│   ├── IdentityVerification.tsx # ZK-proof identity verification
│   ├── WalletConnector.tsx     # Wallet connection UI
│   └── ui/                     # shadcn UI components
└── lib/
    ├── contractInteraction.ts  # Smart contract functions
    └── bigint-polyfill.ts      # BigInt serialization helper
```

## Learn More

To learn more about Next.js and Concordium:

- [Next.js Documentation](https://nextjs.org/docs)
- [Concordium Documentation](https://developer.concordium.software/)
- [shadcn/ui](https://ui.shadcn.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

