// app/api/create-crypto-charge/route.ts

import { NextResponse } from 'next/server';
import { Client, resources, CreateCharge } from 'coinbase-commerce-node';
import { currentUser } from "@clerk/nextjs/server";

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);
const { Charge } = resources;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount } = await req.json();

    const chargeData: CreateCharge = {
      name: "Premium Subscription",
      description: "Monthly subscription for premium features",
      local_price: {
        amount: amount.toString(),
        currency: "USD"
      },
      pricing_type: "fixed_price",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    };

    const charge = await Charge.create(chargeData);

    console.log('Created charge:', JSON.stringify(charge, null, 2));

    if (!charge.id) {
      console.error('Charge created without ID:', charge);
      return new NextResponse("Failed to create charge", { status: 500 });
    }

    return NextResponse.json({ chargeId: charge.id });
  } catch (error) {
    console.error('[CRYPTO_CHARGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}