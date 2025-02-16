// app/api/channel-subscriptions/update-card-details/route.ts

import { NextResponse } from 'next/server';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { subscriptionId } = await req.json();

    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'items.data.price.product'],
    });

    let lastFourDigits = null;
    if (typeof stripeSubscription.default_payment_method === 'object' && stripeSubscription.default_payment_method?.card) {
      lastFourDigits = stripeSubscription.default_payment_method.card.last4;
    }

    const product = stripeSubscription.items.data[0].price.product as Stripe.Product;
    const channelId = product.metadata.channelId;
    const tierName = product.metadata.tierName;

    const channelSubscription = await db.channelSubscription.upsert({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
      update: {
        status: 'active',
        tierName: tierName,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        lastFourDigits,
      },
      create: {
        subscriberId: self.id,
        channelId: channelId,
        status: 'active',
        tierName: tierName,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        lastFourDigits,
      },
    });

    return NextResponse.json({ lastFourDigits });
  } catch (error) {
    console.error('Error updating card details:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}