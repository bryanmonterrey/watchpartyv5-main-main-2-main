// app/api/webhooks/coinbase/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Client, Webhook, ChargeResource } from 'coinbase-commerce-node';
import { db } from "@/lib/db";

Client.init(process.env.COINBASE_COMMERCE_API_KEY!);

function isChargeResource(data: any): data is ChargeResource {
  return data && typeof data === 'object' && 'metadata' in data;
}

export async function POST(req: Request) {
  console.log('Coinbase webhook received');
  const rawBody = await req.text();
  const signature = headers().get("X-CC-Webhook-Signature") as string;

  try {
    const event = Webhook.verifyEventBody(
      rawBody,
      signature,
      process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!
    );
    console.log('Webhook event type:', event.type);

    if (event.type === 'charge:confirmed' && isChargeResource(event.data)) {
      const chargeData = event.data;
      const { channelId, tierName, userId, isUpgrade } = chargeData.metadata;
      console.log('Charge metadata:', { channelId, tierName, userId, isUpgrade });

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
              cryptoPaymentId: chargeData.id,
              stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            create: {
              subscriberId: userId,
              channelId: channelId,
              status: 'active',
              tierName: tierName,
              cryptoPaymentId: chargeData.id,
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
    } else if (event.type === 'charge:failed') {
      console.log('Charge failed:', event.data);
      if (isChargeResource(event.data)) {
        const { channelId, userId } = event.data.metadata;
        if (channelId && userId) {
          await db.channelSubscription.update({
            where: {
              subscriberId_channelId: {
                subscriberId: userId,
                channelId: channelId,
              },
            },
            data: { status: 'failed' },
          });
        }
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing Coinbase Commerce webhook:', error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}