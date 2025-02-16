// app/api/channel-subscriptions/edit-payment-method/route.ts

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

    const body = await req.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return new NextResponse("Missing subscription ID", { status: 400 });
    }

    const subscription = await db.channelSubscription.findFirst({
      where: {
        id: subscriptionId,
        subscriberId: self.id,
      },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    if (!self.stripeCustomerId) {
      return new NextResponse("Stripe customer not found", { status: 404 });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: self.stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('[EDIT_PAYMENT_METHOD_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}