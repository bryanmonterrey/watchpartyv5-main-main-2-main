// app/api/stripe/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSelf } from '@/lib/auth-service';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const user = await getSelf();
    const { priceId } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.log('[STRIPE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}