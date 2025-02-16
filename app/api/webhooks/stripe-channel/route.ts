// app/api/webhooks/stripe-channel/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_CHANNEL_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "invoice.paid") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.channelSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'active',
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  if (event.type === "invoice.payment_failed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.channelSubscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'inactive' },
    });
  }

  return new NextResponse(null, { status: 200 });
}