// app/api/webhooks/stripe/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  console.log('Stripe webhook received');
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('Webhook event type:', event.type);
  } catch (error: any) {
    console.error('Error verifying webhook:', error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleSuccessfulPaymentIntent(paymentIntent);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeletion(deletedSubscription);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await handleSuccessfulPayment(invoice);
      }
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      if (failedInvoice.subscription) {
        await handleFailedPayment(failedInvoice);
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

async function handleSuccessfulPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  console.log('Handling successful payment intent:', paymentIntent.id);
  const { channelId, tierName, userId } = paymentIntent.metadata;
  console.log('Payment intent metadata:', { channelId, tierName, userId });

  if (channelId && tierName && userId) {
    console.log('Attempting to upsert channel subscription');
    try {
      const result = await db.channelSubscription.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: userId,
            channelId: channelId,
          },
        },
        update: {
          status: 'active',
          tierName: tierName,
          stripeSubscriptionId: paymentIntent.id,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          subscriberId: userId,
          channelId: channelId,
          status: 'active',
          tierName: tierName,
          stripeSubscriptionId: paymentIntent.id,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log('Channel subscription upsert result:', result);
    } catch (error) {
      console.error('Error upserting channel subscription:', error);
    }
  } else {
    console.log('Missing metadata for channel subscription');
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Handling subscription change:', subscription.id);
  const channelId = subscription.metadata.channelId;
  const userId = subscription.metadata.userId;
  const tierName = subscription.metadata.tierName;
  console.log('Subscription metadata:', { channelId, userId, tierName });

  if (channelId && userId) {
    console.log('Attempting to upsert channel subscription');
    try {
      const result = await db.channelSubscription.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: userId,
            channelId: channelId,
          },
        },
        update: {
          status: subscription.status,
          tierName: tierName,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          subscriberId: userId,
          channelId: channelId,
          status: subscription.status,
          tierName: tierName,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      console.log('Channel subscription upsert result:', result);
    } catch (error) {
      console.error('Error upserting channel subscription:', error);
    }
  } else {
    console.log('Attempting to upsert website subscription');
    try {
      const result = await db.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        update: {
          status: subscription.status,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          userId: subscription.metadata.userId,
          status: subscription.status,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      console.log('Website subscription upsert result:', result);
    } catch (error) {
      console.error('Error upserting website subscription:', error);
    }
  }
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  console.log('Handling subscription deletion:', subscription.id);
  const channelId = subscription.metadata.channelId;
  const userId = subscription.metadata.userId;

  if (channelId && userId) {
    console.log('Attempting to update channel subscription');
    try {
      const result = await db.channelSubscription.update({
        where: {
          subscriberId_channelId: {
            subscriberId: userId,
            channelId: channelId,
          },
        },
        data: {
          status: 'canceled',
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      console.log('Channel subscription update result:', result);
    } catch (error) {
      console.error('Error updating channel subscription:', error);
    }
  } else {
    console.log('Attempting to update website subscription');
    try {
      const result = await db.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: 'canceled',
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      console.log('Website subscription update result:', result);
    } catch (error) {
      console.error('Error updating website subscription:', error);
    }
  }
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  console.log('Handling successful payment:', invoice.id);
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionChange(subscription);
  }
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  console.log('Handling failed payment:', invoice.id);
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const channelId = subscription.metadata.channelId;
    const userId = subscription.metadata.userId;

    if (channelId && userId) {
      console.log('Attempting to update channel subscription');
      try {
        const result = await db.channelSubscription.update({
          where: {
            subscriberId_channelId: {
              subscriberId: userId,
              channelId: channelId,
            },
          },
          data: {
            status: 'past_due',
          },
        });
        console.log('Channel subscription update result:', result);
      } catch (error) {
        console.error('Error updating channel subscription:', error);
      }
    } else {
      console.log('Attempting to update website subscription');
      try {
        const result = await db.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: 'past_due',
          },
        });
        console.log('Website subscription update result:', result);
      } catch (error) {
        console.error('Error updating website subscription:', error);
      }
    }
  }
}