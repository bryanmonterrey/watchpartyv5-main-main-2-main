// app/api/channel-subscriptions/subscription/[subscriptionId]/route.ts

import { NextResponse } from 'next/server';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(
  req: Request,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await db.channelSubscription.findUnique({
      where: {
        id: params.subscriptionId,
        subscriberId: self.id,
      },
    });

    if (!subscription) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    let lastFourDigits = null;
    if (subscription.stripeSubscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId, {
        expand: ['default_payment_method'],
      });

      if (typeof stripeSubscription.default_payment_method === 'object' && stripeSubscription.default_payment_method?.card) {
        lastFourDigits = stripeSubscription.default_payment_method.card.last4;
      }
    }

    return NextResponse.json({
      ...subscription,
      lastFourDigits,
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}