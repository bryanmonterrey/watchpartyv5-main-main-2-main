import { Client, resources, CreateCharge } from 'coinbase-commerce-node';

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);
const { Charge } = resources;

export const createCharge = async (amount: number, name: string, description: string, metadata?: Record<string, string>) => {
  const chargeData = {
    name: name,
    description: description,
    local_price: {
      amount: amount.toString(),
      currency: 'USD'
    },
    pricing_type: 'fixed_price' as const,
    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    payment_method_types: ['bitcoin', 'ethereum', 'usdc'],
    metadata: metadata,
  } as CreateCharge;

  try {
    const charge = await Charge.create(chargeData);
    console.log('Created charge:', JSON.stringify(charge, null, 2));
    return charge;
  } catch (error) {
    console.error('Error creating Coinbase Commerce charge:', error);
    throw error;
  }
};

export const checkChargeStatus = async (chargeId: string) => {
  try {
    const charge = await Charge.retrieve(chargeId);
    return charge.timeline[charge.timeline.length - 1].status;
  } catch (error) {
    console.error('Error checking Coinbase Commerce charge status:', error);
    throw error;
  }
};