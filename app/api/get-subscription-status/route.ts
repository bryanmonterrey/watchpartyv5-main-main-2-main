// app/api/get-subscription-status/route.ts
import { NextResponse } from 'next/server';
import { getSubscriptionStatus } from '@/lib/auth-service.server';

export async function GET() {
  try {
    const status = await getSubscriptionStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
  }
}