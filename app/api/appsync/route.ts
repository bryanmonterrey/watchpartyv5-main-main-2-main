import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { HttpRequest } from '@aws-sdk/protocol-http';

const APPSYNC_ENDPOINT = process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT!;
const AWS_REGION = process.env.AWS_REGION!;

export async function POST(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query, variables } = await request.json();

    const endpoint = new URL(APPSYNC_ENDPOINT);
    const signer = new SignatureV4({
      credentials: defaultProvider(),
      region: AWS_REGION,
      service: 'appsync',
      sha256: Sha256
    });

    const requestToSign = new HttpRequest({
      method: 'POST',
      hostname: endpoint.hostname,
      path: endpoint.pathname,
      headers: {
        'Content-Type': 'application/json',
        host: endpoint.host
      },
      body: JSON.stringify({ query, variables })
    });

    const signedRequest = await signer.sign(requestToSign);

    const response = await fetch(APPSYNC_ENDPOINT, {
      method: 'POST',
      headers: signedRequest.headers,
      body: signedRequest.body
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to AppSync:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}