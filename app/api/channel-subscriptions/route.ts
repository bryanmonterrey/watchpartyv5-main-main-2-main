// app/api/channel-subscriptions/route.ts

import { NextResponse } from 'next/server';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const self = await getSelf();

    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptions = await db.channelSubscription.findMany({
      where: {
        subscriberId: self.id,
      },
      include: {
        channelUser: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedSubscriptions = subscriptions.map((sub) => {
      const isCrypto = !!sub.cryptoPaymentId;
      return {
        id: sub.id,
        channelName: sub.channelUser.username,
        dateJoined: sub.createdAt.toISOString(),
        status: sub.status,
        tierName: sub.tierName,
        endDate: sub.stripeCurrentPeriodEnd?.toISOString(),
        paymentMethod: isCrypto ? 'crypto' : 'stripe',
        lastFourDigits: sub.lastFourDigits,
      };
    });

    return NextResponse.json(formattedSubscriptions);
  } catch (error) {
    console.error('[GET_CHANNEL_SUBSCRIPTIONS_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}