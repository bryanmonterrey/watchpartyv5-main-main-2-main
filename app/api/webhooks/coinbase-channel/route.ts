// app/api/webhooks/coinbase-channel/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Client, Webhook, resources } from 'coinbase-commerce-node';
import { db } from "@/lib/db";

Client.init(process.env.COINBASE_COMMERCE_API_KEY!);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = headers().get("X-CC-Webhook-Signature") as string;

  try {
    const event = Webhook.verifyEventBody(
      rawBody,
      signature,
      process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!
    );

    if (event.type === 'charge:confirmed') {
      const charge = event.data as resources.Charge;
      const metadata = charge.metadata as { subscriptionId?: string };

      if (metadata && metadata.subscriptionId) {
        await db.channelSubscription.update({
          where: { id: metadata.subscriptionId },
          data: {
            status: 'active',
            stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing Coinbase Commerce webhook:', error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}