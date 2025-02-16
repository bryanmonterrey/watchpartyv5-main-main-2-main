// app/api/channel-tiers/[channelId]/route.ts

import { NextResponse } from 'next/server';

// This could be fetched from your database based on the channelId
const getTiersForChannel = (channelId: string) => [
  { name: 'Basic', price: 5.99 },
  { name: 'Pro', price: 9.99 },
  { name: 'Premium', price: 24.99 },
];

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channelId = params.channelId;

  try {
    const tiers = getTiersForChannel(channelId);

    return NextResponse.json({ tiers });
  } catch (error) {
    console.error('Error fetching tiers:', error);
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }
}