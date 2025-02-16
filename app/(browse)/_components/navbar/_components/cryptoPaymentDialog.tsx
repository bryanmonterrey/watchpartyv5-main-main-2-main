import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { copyToClipboard } from '@/lib/utils';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface CryptoPaymentDialogProps {
  chargeId: string;
  amount: number;
  onBack: () => void;
}

interface PaymentOption {
  address: string;
  amount: string;
  currency: string;
  cryptoAmount: string;
  cryptoCurrency: string;
}

type CryptoName = 'ethereum' | 'polygon' | 'base';

const cryptoIcons: Record<string, React.ReactNode> = {
  'ethereum': <Image src="/eth.png" alt="eth" width={15} height={15} className="mr-2" />,
  'polygon': <Image src="/poly.png" alt="poly" width={16} height={16}className="mr-2" />,
  'base': <Image src="/base.png" alt="base" width={16} height={16} className="mr-2"/>,
};

export const CryptoPaymentDialog: React.FC<CryptoPaymentDialogProps> = ({ chargeId, amount, onBack }) => {
  const [paymentOptions, setPaymentOptions] = useState<Record<CryptoName, Record<string, PaymentOption>>>({
    ethereum: {}, polygon: {}, base: {}
  });
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoName>('ethereum');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fetchPaymentOptions = useCallback(async () => {
    if (chargeId) {
      try {
        const response = await fetch(`/api/get-crypto-charge-details?chargeId=${chargeId}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment options');
        }
        const data = await response.json();
        setPaymentOptions(data.paymentOptions);
        setExpiresAt(data.expiresAt);
        if (Object.keys(data.paymentOptions).length > 0) {
          const firstNetwork = Object.keys(data.paymentOptions)[0] as CryptoName;
          setSelectedNetwork(firstNetwork);
          const firstCurrency = Object.keys(data.paymentOptions[firstNetwork])[0];
          setSelectedCurrency(firstCurrency);
        }
      } catch (error) {
        console.error('Error fetching charge details:', error);
        toast.error('Failed to load payment details. Please try again.');
      }
    }
  }, [chargeId]);

  useEffect(() => {
    fetchPaymentOptions();
  }, [fetchPaymentOptions, chargeId, amount]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (chargeId) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch('/api/check-crypto-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chargeId }),
          });
          if (!response.ok) {
            throw new Error('Failed to check payment status');
          }
          const data = await response.json();
          if (data.status === 'completed') {
            clearInterval(intervalId);
            toast.success('Crypto payment successful!');
            router.refresh();
          }
        } catch (error) {
          console.error('Error checking crypto payment status:', error);
        }
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [chargeId, router]);

  const handleCopyAddress = async () => {
    if (selectedNetwork && selectedCurrency && paymentOptions[selectedNetwork][selectedCurrency]) {
      await copyToClipboard(paymentOptions[selectedNetwork][selectedCurrency].address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="">
      {Object.keys(paymentOptions).length > 0 ? (
        <>

<div className="mb-4">
            <label className="block text-sm font-medium text-litepurp mb-1">Supported Currency</label>
            <Select 
              onValueChange={(value: string) => {
                setSelectedCurrency(value);
              }} 
              value={selectedCurrency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(paymentOptions[selectedNetwork]).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    <div className="flex items-center">
                      <Image
                        src={`/crypto-icons/${currency.toLowerCase()}.png`}
                        alt={currency}
                        width={15}
                        height={15}
                        className="mr-2"
                      />
                      {currency}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-litepurp mb-1">Network</label>
            <Select 
                onValueChange={(value: CryptoName) => {
                setSelectedNetwork(value);
                // Reset selected currency when network changes
                setSelectedCurrency(Object.keys(paymentOptions[value])[0]);
              }} 
              value={selectedNetwork}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(paymentOptions) as CryptoName[]).map((network) => (
                  <SelectItem key={network} value={network}>
                    <div className="flex items-center">
                      {cryptoIcons[network]}
                      {network.charAt(0).toUpperCase() + network.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          
          {selectedNetwork && selectedCurrency && paymentOptions[selectedNetwork][selectedCurrency] && (
            <>
              <p className="mt-4">
                Please send {amount} {paymentOptions[selectedNetwork][selectedCurrency].currency} 
                <span> </span>worth of {selectedCurrency} to the following address:
              </p>
              <p className="mt-2 text-sm text-litepurp">
                (Exchange rate will be calculated at the time of payment)
              </p>
              <div className="mt-4 flex justify-center items-center">
                <div className="flex-grow relative">
                  <p className="font-mono bg-gray-100 p-2 pr-10 text-black rounded break-all text-xs">
                    {paymentOptions[selectedNetwork][selectedCurrency].address}
                  </p>
                  <button 
                    onClick={handleCopyAddress}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="ml-4">
                  <div className="rounded-lg overflow-hidden">
                    <QRCodeSVG
                      value={paymentOptions[selectedNetwork][selectedCurrency].address}
                      size={75}
                      level="L"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <p className="mt-4 text-sm text-litepurp">
            The payment will be automatically detected once it&apos;s confirmed on the blockchain.
          </p>
          <p className="mt-2 text-sm text-litepurp">
            This payment option expires at: {new Date(expiresAt).toLocaleString()}
          </p>
        </>
      ) : (
        <p>No payment options are currently available. Please try again later.</p>
      )}
    </div>
  );
};