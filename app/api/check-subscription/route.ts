// app/api/check-subscription/route.ts

import { NextResponse } from 'next/server';
import { getSubscriptionStatus } from '@/lib/auth-service';

export async function GET() {
  try {
    const subscriptionStatus = await getSubscriptionStatus();
    return NextResponse.json({ 
      isSubscribed: subscriptionStatus?.isSubscribed || false 
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ isSubscribed: false }, { status: 500 });
  }
}