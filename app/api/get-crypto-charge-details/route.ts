// app/api/get-crypto-charge-details/route.ts

import { NextResponse } from 'next/server';
import { Client, resources } from 'coinbase-commerce-node';

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);
const { Charge } = resources;

type CryptoName = 'ethereum' | 'polygon' | 'base';

interface ExtendedCharge extends resources.Charge {
  web3_data?: {
    contract_addresses: Record<string, string>;
  };
  pricing: {
    local: { amount: string; currency: string };
    [key: string]: { amount: string; currency: string };
  };
}

const supportedCurrencies: Record<CryptoName, string[]> = {
  'ethereum': ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'UNI', 'LINK', 'AAVE', 'MKR', 'COMP', 'SNX', 'YFI', 'BAT', 'SUSHI', 'GRT'],
  'polygon': ['MATIC', 'WETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'AAVE', 'LINK', 'UNI', 'SUSHI', 'COMP', 'BAT', 'CRV'],
  'base': ['ETH', 'USDC', 'DAI', 'cbETH', 'WETH', 'USDbC', 'BALD', 'TRAC', 'MV', 'COMB'],
};

export async function GET(req: Request) {
  console.log('GET request received for get-crypto-charge-details');
  const { searchParams } = new URL(req.url);
  const chargeId = searchParams.get('chargeId');

  if (!chargeId) {
    console.log('No chargeId provided');
    return new NextResponse("Charge ID is required", { status: 400 });
  }

  console.log(`Attempting to retrieve charge with ID: ${chargeId}`);

  try {
    const charge = await Charge.retrieve(chargeId) as ExtendedCharge;
    
    console.log('Charge data retrieved successfully');
    console.log('Charge data:', JSON.stringify(charge, null, 2));

    const supportedChains: Record<CryptoName, string> = {
      'ethereum': '1',
      'polygon': '137',
      'base': '8453'
    };

    console.log('Processing payment options');

    const paymentOptions = Object.entries(supportedChains).reduce((acc, [name, chainId]) => {
      const networkName = name as CryptoName;
      console.log(`Processing network: ${networkName}`);
      if (charge.web3_data?.contract_addresses[chainId]) {
        console.log(`Contract address found for chain ID: ${chainId}`);
        const networkCurrencies = supportedCurrencies[networkName];
        const networkOptions = networkCurrencies.reduce((currencyAcc, currency) => {
          console.log(`Adding currency: ${currency}`);
          currencyAcc[currency] = {
            address: charge.web3_data!.contract_addresses[chainId],
            amount: charge.pricing.local.amount,
            currency: charge.pricing.local.currency,
            cryptoAmount: '0', // This will be filled in by the frontend
            cryptoCurrency: currency,
          };
          return currencyAcc;
        }, {} as Record<string, {
          address: string;
          amount: string;
          currency: string;
          cryptoAmount: string;
          cryptoCurrency: string;
        }>);
        
        if (Object.keys(networkOptions).length > 0) {
          console.log(`Adding options for network: ${networkName}`);
          acc[networkName] = networkOptions;
        } else {
          console.log(`No options found for network: ${networkName}`);
        }
      } else {
        console.log(`No contract address found for chain ID: ${chainId}`);
      }
      return acc;
    }, {} as Record<CryptoName, Record<string, {
      address: string;
      amount: string;
      currency: string;
      cryptoAmount: string;
      cryptoCurrency: string;
    }>>);

    console.log('Processed payment options:', JSON.stringify(paymentOptions, null, 2));

    if (Object.keys(paymentOptions).length === 0) {
      console.log('No payment options available');
      return new NextResponse(JSON.stringify({ paymentOptions: {}, expiresAt: charge.expires_at }), { status: 200 });
    }

    console.log('Returning payment options');
    return NextResponse.json({
      paymentOptions,
      expiresAt: charge.expires_at,
    });
  } catch (error) {
    console.error('Error retrieving charge details:', error);
    if (error instanceof Error) {
      return new NextResponse(`Failed to retrieve charge details: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Failed to retrieve charge details", { status: 500 });
  }
}