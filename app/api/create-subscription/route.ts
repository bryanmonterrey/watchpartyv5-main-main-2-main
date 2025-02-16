// app/api/create-subscription/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSelf } from '@/lib/auth-service';

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

    // Create or retrieve the customer
    let customer;
    if (user.email) {
      const existingCustomers = await stripe.customers.list({
        email: user.email,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
        });
      }
    } else {
      // If email is not available, create a customer with a placeholder email
      customer = await stripe.customers.create({
        email: `user-${user.id}@example.com`, // Use a placeholder email
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log('[SUBSCRIPTION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}