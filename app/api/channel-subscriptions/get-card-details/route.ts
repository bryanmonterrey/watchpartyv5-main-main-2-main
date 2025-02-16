// app/api/channel-subscriptions/get-card-details/route.ts

import { NextResponse } from 'next/server';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(req: Request) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return new NextResponse("Subscription ID is required", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method'],
    });

    let lastFourDigits: string | undefined;
    if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
      lastFourDigits = subscription.default_payment_method.card?.last4;
    }

    if (lastFourDigits) {
      await db.channelSubscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: { lastFourDigits },
      });
    }

    return NextResponse.json({ lastFourDigits });
  } catch (error) {
    console.error('Error retrieving card details:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}