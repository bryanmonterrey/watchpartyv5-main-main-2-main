import { NextRequest, NextResponse } from 'next/server';
import { startChannel, stopChannel } from '@/actions/ingress';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body['detail-type'] === 'MediaLive Channel State Change') {
      const channelId = body.detail['channel-arn'].split(':').pop();
      const state = body.detail.state;

      if (state === 'RUNNING') {
        // Stream has started
        await startChannel(channelId);
        console.log(`Channel ${channelId} started`);
        return NextResponse.json({ message: 'Channel started' });
      } else if (state === 'IDLE') {
        // Stream has stopped
        await stopChannel(channelId);
        console.log(`Channel ${channelId} stopped`);
        return NextResponse.json({ message: 'Channel stopped' });
      } else {
        console.log(`Unhandled channel state: ${state}`);
        return NextResponse.json({ message: 'Unhandled state' });
      }
    } else {
      return NextResponse.json({ error: 'Unhandled event type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}