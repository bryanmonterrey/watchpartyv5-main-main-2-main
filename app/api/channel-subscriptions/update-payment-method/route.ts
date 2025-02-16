// app/api/channel-subscriptions/update-payment-method/route.ts

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
    const { subscriptionId, paymentMethodId } = body;

    if (!subscriptionId || !paymentMethodId) {
      return new NextResponse("Missing required fields", { status: 400 });
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

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      default_payment_method: paymentMethodId,
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.type === 'card' && paymentMethod.card) {
      await db.channelSubscription.update({
        where: { id: subscriptionId },
        data: { lastFourDigits: paymentMethod.card.last4 },
      });
    }

    return NextResponse.json({ message: "Payment method updated successfully" });
  } catch (error) {
    console.error('[UPDATE_PAYMENT_METHOD_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}