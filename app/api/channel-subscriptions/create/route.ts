// app/api/channel-subscriptions/create/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSelf } from '@/lib/auth-service';
import Stripe from 'stripe';
import { createCharge } from '@/lib/coinbase';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

async function getOrCreateStripeCustomer(userId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const stripeCustomer = await stripe.customers.create({
    email,
    metadata: { userId }
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: stripeCustomer.id }
  });

  return stripeCustomer.id;
}

async function getOrCreateStripeProduct(channelId: string, tierName: string) {
  let products = await stripe.products.list({
    active: true,
  });

  let product = products.data.find(p => 
    p.metadata.channelId === channelId && p.metadata.tierName === tierName
  );

  if (product) {
    return product.id;
  }

  const newProduct = await stripe.products.create({
    name: `${tierName} Subscription for Channel ${channelId}`,
    metadata: { channelId, tierName }
  });

  return newProduct.id;
}

export async function POST(req: Request) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { channelId, tierName, amount, paymentType, duration } = body;

    const existingSubscription = await prisma.channelSubscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
    });

    const isUpgrade = !!existingSubscription;

    if (paymentType === 'stripe') {
      const stripeCustomerId = await getOrCreateStripeCustomer(self.id, self.email);
      const productId = await getOrCreateStripeProduct(channelId, tierName);

      let prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: 'recurring',
      });

      let price: Stripe.Price;
      const intervalMap: { [key: string]: 'day' | 'week' | 'month' | 'year' } = {
        'Monthly': 'month',
        '3 Months': 'month',
        '6 Months': 'month',
        '9 Months': 'month',
        'Annual': 'year'
      };
      const interval = intervalMap[duration];
      const intervalCount = duration === 'Monthly' ? 1 : duration === 'Annual' ? 12 : parseInt(duration.split(' ')[0]);

      if (prices.data.length === 0 || !prices.data.find(p => p.recurring?.interval === interval && p.recurring?.interval_count === intervalCount)) {
        price = await stripe.prices.create({
          product: productId,
          unit_amount: Math.round(amount * 100),
          currency: 'usd',
          recurring: { 
            interval,
            interval_count: intervalCount
          },
        });
      } else {
        price = prices.data.find(p => p.recurring?.interval === interval && p.recurring?.interval_count === intervalCount)!;
      }

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { 
          channelId, 
          tierName, 
          userId: self.id, 
          isUpgrade: isUpgrade ? 'true' : 'false',
          duration
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return NextResponse.json({ 
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      });
    } else if (paymentType === 'crypto') {
      const charge = await createCharge(
        amount,
        `${tierName} Channel Subscription for ${channelId} (${duration})`,
        `${isUpgrade ? 'Upgrade' : 'Subscription'} to channel ${channelId} for ${duration}`,
        { channelId, tierName, userId: self.id, isUpgrade: isUpgrade ? 'true' : 'false', duration }
      );

      return NextResponse.json({ chargeId: charge.id });
    }

    return new NextResponse("Invalid payment type", { status: 400 });
  } catch (error) {
    console.error('Error creating channel subscription:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}