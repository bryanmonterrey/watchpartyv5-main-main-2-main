// app/api/channel-subscriptions/channel/[channelId]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSelf } from '@/lib/auth-service';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const self = await getSelf();
    if (!self) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channelId = params.channelId;

    const subscription = await prisma.channelSubscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
      select: {
        tierName: true,
        status: true,
        stripeSubscriptionId: true,
        cryptoPaymentId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    let lastFourDigits;
    if (subscription.stripeSubscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId, {
        expand: ['default_payment_method'],
      });
      
      if (typeof stripeSubscription.default_payment_method === 'object' && stripeSubscription.default_payment_method?.card) {
        lastFourDigits = stripeSubscription.default_payment_method.card.last4;
      } else if (typeof stripeSubscription.default_payment_method === 'string') {
        const paymentMethod = await stripe.paymentMethods.retrieve(stripeSubscription.default_payment_method);
        lastFourDigits = paymentMethod.card?.last4;
      }
    }

    const tier = await prisma.channelProduct.findFirst({
      where: {
        userId: channelId,
        name: subscription.tierName,
      },
      select: {
        price: true,
      },
    });

    return NextResponse.json({
      subscription: {
        ...subscription,
        price: tier?.price || 0,
        paymentMethod: subscription.stripeSubscriptionId ? 'stripe' : 'crypto',
        lastFourDigits,
      },
    });
  } catch (error) {
    console.error('Error fetching channel subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch channel subscription' }, { status: 500 });
  }
}