//  app/api/check-crypto-payment/route.ts

import { NextResponse } from 'next/server';
import { Client, resources } from 'coinbase-commerce-node';

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);
const { Charge } = resources;

export async function POST(req: Request) {
  try {
    const { chargeId } = await req.json();

    if (!chargeId) {
      return new NextResponse("Charge ID is required", { status: 400 });
    }

    const charge = await Charge.retrieve(chargeId);

    // Check if any payment has been detected
    const lastPayment = charge.payments[charge.payments.length - 1];
    
    if (lastPayment) {
      switch (lastPayment.status) {
        case 'COMPLETED':
          // Payment confirmed, update your database or perform any necessary actions
          return NextResponse.json({ status: 'completed', paymentDetails: lastPayment });
        case 'PENDING':
          return NextResponse.json({ status: 'pending', paymentDetails: lastPayment });
        case 'UNRESOLVED':
          return NextResponse.json({ status: 'unresolved', paymentDetails: lastPayment });
        case 'RESOLVED':
          return NextResponse.json({ status: 'resolved', paymentDetails: lastPayment });
        case 'EXPIRED':
          return NextResponse.json({ status: 'expired', paymentDetails: lastPayment });
        case 'CANCELED':
          return NextResponse.json({ status: 'canceled', paymentDetails: lastPayment });
        default:
          return NextResponse.json({ status: 'unknown', paymentDetails: lastPayment });
      }
    } else {
      return NextResponse.json({ status: 'not_paid' });
    }
  } catch (error) {
    console.error('Error checking crypto payment status:', error);
    return new NextResponse("Failed to check payment status", { status: 500 });
  }
}