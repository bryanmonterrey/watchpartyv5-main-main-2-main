// app/api/cancel-subscription/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST() {
  try {
    const user = await getSelf();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });

    if (!dbUser || !dbUser.subscription) {
      return new NextResponse("No active subscription found", { status: 404 });
    }

    // Add this check
    if (!dbUser.subscription.stripeSubscriptionId) {
      return new NextResponse("Invalid subscription data", { status: 400 });
    }

    const subscription = await stripe.subscriptions.update(
      dbUser.subscription.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    // Update the subscription status in your database
    await db.subscription.update({
      where: { id: dbUser.subscription.id },
      data: {
        status: "canceled",
        // You might want to store the cancellation date or other relevant information
      }
    });

    return NextResponse.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}