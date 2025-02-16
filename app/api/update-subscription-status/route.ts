// app/api/update-subscription-status/route.ts

import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { subscribed, stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd, } = await req.json();

        const dbUser = await db.user.findUnique({
            where: { externalUserId: user.id },
            include: { subscription: true },
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        if (subscribed) {
            await db.user.update({
                where: { id: dbUser.id },
                data: {
                    subscription: {
                        upsert: {
                            create: {
                                status: "active",
                                stripeCustomerId,
                                stripeSubscriptionId,
                                stripePriceId,
                                stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                            },
                            update: {
                                status: "active",
                                stripeCustomerId,
                                stripeSubscriptionId,
                                stripePriceId,
                                stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                            }
                        }
                    }
                }
            });
        } else if (dbUser.subscription) {
            await db.subscription.update({
                where: { id: dbUser.subscription.id },
                data: {
                    status: "canceled",
                }
            });
        }

        return NextResponse.json({ message: "Subscription status updated successfully" });
    } catch (error) {
        console.error('Error updating subscription status:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}