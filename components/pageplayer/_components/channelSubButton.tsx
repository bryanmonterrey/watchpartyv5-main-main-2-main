import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, Tab } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react";
import { Card, CardContent } from "@/components/ui/card"
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CryptoPaymentDialog } from '@/app/(browse)/_components/navbar/_components/cryptoPaymentDialog';
import { cn } from "@/lib/utils";
import { UserAvatar } from '@/components/useravatar';
import Image from 'next/image';
import { Check } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Tier {
  name: string;
  price: number;
  features: string[];
}

const tiers: Tier[] = [
  { name: 'Basic', price: 5, features: ['Drop emotes in chat with 41 custom emotes', 'Sub Badges'] },
  { name: 'Pro', price: 10, features: ['Everything in Basic, and', '1 emote modifier', 'Pro Badge Flair', 'Discord Role'] },
  { name: 'Premium+', price: 24, features: ['Everything in Pro, and', '2 emote modifiers', 'Premium+ Badge Flair'] },
];

const durations = ['Monthly', '3 Months', '6 Months', '9 Months', 'Annual'] as const;
type Duration = typeof durations[number];

function calculateDiscountedPrice(basePrice: number, duration: Duration): string {
  const monthsMap: { [key in Duration]: number } = {
    'Monthly': 1,
    '3 Months': 3,
    '6 Months': 6,
    '9 Months': 9,
    'Annual': 12
  };
  const months = monthsMap[duration];
  const discount = months === 1 ? 0 : months;
  const price = (basePrice * months * (100 - discount)) / 100;
  
  return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
}

interface CheckoutFormProps {
  amount: string;
  tierName: string;
  channelId: string;
  duration: Duration;
  onSuccess: (data: any) => void;
}

function CheckoutForm({ amount, tierName, channelId, duration, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/channel-subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channelId, 
          tierName, 
          amount: parseFloat(amount), 
          paymentType: 'stripe',
          duration 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const data = await response.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const cardDetailsResponse = await fetch('/api/channel-subscriptions/update-card-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: data.subscriptionId }),
      });

      let lastFourDigits: string | undefined;

      if (!cardDetailsResponse.ok) {
        console.error('Failed to update card details');
      } else {
        const cardData = await cardDetailsResponse.json();
        console.log('Updated card details:', cardData);
        lastFourDigits = cardData.lastFourDigits;
      }

      onSuccess({
        subscriptionId: data.subscriptionId,
        tierName,
        amount,
        lastFourDigits,
        duration
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? 'Processing...' : `Subscribe to ${tierName} ($${amount})`}
      </Button>
    </form>
  );
}

interface CheckoutContentProps {
  discountedPrice: string;
  selectedTier: Tier | null;
  channelId: string;
  selectedDuration: Duration;
  onSuccess: (data: any) => void;
  onBack: () => void;
  cryptoChargeId: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  discountedPrice,
  selectedTier,
  channelId,
  selectedDuration,
  onSuccess,
  onBack,
  cryptoChargeId
}) => {
  const [activeTab, setActiveTab] = useState('card');

  return (
    <>
      <DialogHeader>
        <DialogTitle>Checkout</DialogTitle>
      </DialogHeader>
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
        <Tab key="card" title="Card">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={discountedPrice} 
              tierName={selectedTier?.name || ''} 
              channelId={channelId}
              duration={selectedDuration}
              onSuccess={onSuccess}
            />
          </Elements>
        </Tab>
        <Tab key="crypto" title="Crypto">
          {cryptoChargeId ? (
            <CryptoPaymentDialog 
              chargeId={cryptoChargeId}
              amount={parseFloat(discountedPrice)}
              onBack={onBack}
            />
          ) : (
            <p>Loading crypto payment options...</p>
          )}
        </Tab>
      </Tabs>
      <Button onClick={onBack} className="mt-4">Back to Plan Selection</Button>
    </>
  );
};

interface Subscription {
  tierName: string;
  price: number;
  duration?: Duration;
  lastFourDigits?: string;
}

interface ChannelSubscribeButtonProps {
  channelId: string;
  hostName: string;
  imageUrl: string;
  currentSubscription: Subscription | null;
  isHost: boolean;
}

enum DialogState {
  PlanSelection,
  Checkout,
  HighestTier
}

export const ChannelSubscribeButton: React.FC<ChannelSubscribeButtonProps> = ({ channelId, hostName, imageUrl, currentSubscription, isHost }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>(DialogState.PlanSelection);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [cryptoChargeId, setCryptoChargeId] = useState('');
  const [localSubscription, setLocalSubscription] = useState<Subscription | null>(currentSubscription);
  const router = useRouter();

  const availableOptions = useMemo(() => {
    console.log('Calculating available options');
    console.log('Current subscription:', localSubscription);

    if (!localSubscription) {
      console.log('No current subscription, showing all options');
      return tiers.flatMap(tier => durations.map(duration => ({ tier, duration })));
    }

    const currentTierIndex = tiers.findIndex(t => t.name === localSubscription.tierName);
    const currentDurationIndex = localSubscription.duration ? durations.indexOf(localSubscription.duration) : 0;

    console.log('Current tier index:', currentTierIndex);
    console.log('Current duration index:', currentDurationIndex);

    const options = tiers.flatMap((tier, tIndex) => 
      durations.map((duration, dIndex) => {
        if (tIndex > currentTierIndex || (tIndex === currentTierIndex && dIndex > currentDurationIndex)) {
          console.log(`Including option: ${tier.name} - ${duration}`);
          return { tier, duration };
        }
        console.log(`Excluding option: ${tier.name} - ${duration}`);
        return null;
      })
    ).filter((option): option is { tier: Tier; duration: Duration } => option !== null);

    console.log('Available options:', options);
    return options;
  }, [localSubscription]);

  const availableTiers = useMemo(() => 
    Array.from(new Set(availableOptions.map(option => option.tier))),
    [availableOptions]
  );

  const availableDurations = useMemo(() => {
    const allDurations = Array.from(new Set(availableOptions.map(option => option.duration)));
    return durations.filter(duration => allDurations.includes(duration));
  }, [availableOptions]);

  const discountedPrice = useMemo(() => {
    if (!selectedTier) return '0.00';
    return calculateDiscountedPrice(selectedTier.price, selectedDuration || 'Monthly');
  }, [selectedTier, selectedDuration]);

  const isHighestTier = useMemo(() => availableOptions.length === 0, [availableOptions]);

  useEffect(() => {
    console.log('Current subscription updated:', currentSubscription);
    setLocalSubscription(currentSubscription);
  }, [currentSubscription]);

  useEffect(() => {
    if (availableDurations.length > 0 && !selectedDuration) {
      setSelectedDuration(availableDurations[0]);
    }
  }, [availableDurations, selectedDuration]);

  useEffect(() => {
    if (selectedDuration && availableTiers.length > 0) {
      const tiersForSelectedDuration = availableOptions
        .filter(option => option.duration === selectedDuration)
        .map(option => option.tier);
      if (tiersForSelectedDuration.length > 0) {
        setSelectedTier(tiersForSelectedDuration[0]);
      }
    }
  }, [selectedDuration, availableTiers, availableOptions]);

  const handleSubscribeClick = useCallback(() => {
    if (isHighestTier) {
      setDialogState(DialogState.HighestTier);
    } else {
      setDialogState(DialogState.PlanSelection);
    }
    setIsDialogOpen(true);
  }, [isHighestTier]);

  const handleTierSelect = useCallback((tier: Tier) => {
    setSelectedTier(tier);
  }, []);

  const handleSubscribeAndPay = useCallback(() => {
    if (!selectedTier) {
      toast.error('Please select a subscription tier');
      return;
    }
    setDialogState(DialogState.Checkout);
  }, [selectedTier]);

  const handlePaymentSuccess = useCallback((data: any) => {
    toast.success('Subscription successful!');
    console.log('Subscription data:', data);
    setLocalSubscription(prevState => ({
      ...prevState,
      tierName: data.tierName,
      price: parseFloat(data.amount),
      lastFourDigits: data.lastFourDigits,
      duration: data.duration
    }));
    setIsDialogOpen(false);
    setDialogState(DialogState.PlanSelection);
    router.refresh();
  }, [router]);

  const handleCryptoPayment = useCallback(async () => {
    if (!selectedTier || !selectedDuration) return;
    try {
      const response = await fetch('/api/channel-subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          channelId, 
          tierName: selectedTier.name, 
          amount: parseFloat(discountedPrice), 
          paymentType: 'crypto',
          duration: selectedDuration
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create crypto charge');
      }

      const data = await response.json();
      setCryptoChargeId(data.chargeId);
    } catch (error) {
      console.error('Error creating crypto charge:', error);
      toast.error('Failed to create crypto payment. Please try again.');
    }
  }, [channelId, selectedTier, discountedPrice, selectedDuration]);

  const handleBackToSelection = useCallback(() => {
    setDialogState(DialogState.PlanSelection);
    setCryptoChargeId('');
  }, []);

  useEffect(() => {
    if (dialogState === DialogState.Checkout && !cryptoChargeId) {
      handleCryptoPayment();
    }
  }, [dialogState, cryptoChargeId, handleCryptoPayment]);

  const getBillingFrequency = (duration: Duration | null): string => {
    switch (duration) {
      case 'Monthly':
        return 'billed monthly';
      case '3 Months':
        return 'billed every 3 months';
      case '6 Months':
        return 'billed every 6 months';
      case '9 Months':
        return 'billed every 9 months';
      case 'Annual':
        return 'billed annually';
      default:
        return '';
    }
  };

  return (
    <>
      <Button 
        className="h-[34px] bg-azul hover:bg-[#0054A9] text-black px-6 rounded-md" 
        onClick={handleSubscribeClick}
        disabled={isHost}
      >
        {localSubscription ? <div className='inline-flex gap-x-1.5'><p>Subscribe</p></div> : <div className='inline-flex gap-x-1'><p>Subscribe</p></div>}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setDialogState(DialogState.PlanSelection);
          setCryptoChargeId('');
          setSelectedDuration(null);
          setSelectedTier(null);
        }
      }}>
        <DialogContent className={cn("max-w-max z-50")}>
          {dialogState === DialogState.PlanSelection && (
            <>
              <DialogHeader>
                <DialogTitle className='text-3xl mx-auto font-bold'>
                  {localSubscription ? `Upgrade your subscription to ${hostName}` : `Subscribe to ${hostName}`}
                </DialogTitle>
                <DialogDescription className='mx-auto text-lg'>
                  <div className='flex my-2 justify-center'>
                    <UserAvatar 
                      imageUrl={imageUrl}
                      username={hostName}
                      size="lg"
                      showBadge
                    />
                  </div>
                  <p className='text-white'>Enjoy an enhanced experience, ad-free streams, sub-only chat, subscriber streams, and more.</p>
                </DialogDescription>
              </DialogHeader>
              
              {availableOptions.length > 0 ? (
                <>
                  <Tabs 
                    selectedKey={selectedDuration || undefined}
                    onSelectionChange={(key) => setSelectedDuration(key as Duration)}
                    className={cn("px-5 m-auto mt-4")}
                  >
                    {availableDurations.map(duration => (
                      <Tab key={duration} title={duration}>
                        <div className={cn("flex justify-center gap-x-8")}>
                        {availableTiers
  .filter(tier => availableOptions.some(option => option.tier === tier && option.duration === duration))
  .map(tier => (
    <Card 
      className={cn(
        "inline-flex mt-6 justify-center border-4 border-transparent cursor-pointer transition-all ease-in-out duration-500 mb-4",
        selectedTier?.name === tier.name && "border-4 border-lightpurp transition-all ease-in-out duration-500"
      )}
      key={tier.name}
      onClick={() => handleTierSelect(tier)}
    >
      <CardContent className='w-full relative'>
        <Checkbox
          size="sm"
          color="primary"
          radius="full"
          icon={<Check strokeWidth={5} height={40} width={40} className='absolute h-3.5 w-3.5'/>}
          isSelected={selectedTier?.name === tier.name}
          onChange={() => handleTierSelect(tier)}
          onClick={(e) => e.stopPropagation()} 
          classNames={{
            base: cn(
              "absolute top-3 right-3",
              "data-[selected=true]:border-lightpurp"
            ),
            wrapper: cn(
              "before:border-none before:bg-bgblack after:p-0 after:mr-0 after:ml-0",
              "data-[selected=true]:border-lightpurp",
              "w-4 h-4"
            ),
            icon: "w-3 h-3",
          }}
        />
        <h3 className="text-2xl font-bold text-white mb-2 mt-1 -ml-2">
          {tier.name}
        </h3>
        <p className='text-4xl font-bold -mt-2 -ml-2'>
          ${calculateDiscountedPrice(tier.price, duration)}
          <span className='font-semibold text-base'> / month</span>
        </p>
        <ul className='text-xs -ml-2 mt-1'>
          {tier.features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  ))}

                        </div>
                      </Tab>
                    ))}
                  </Tabs>
                  
                  <div className='inline-flex justify-center gap-x-8'>
                    <div className='-space-y-1 inline-block'>
                      <p className='font-semibold text-xl'>{selectedTier?.name}</p>
                      <p className='font-semibold text-3xl'>${discountedPrice} <span className='font-semibold text-base'> / month</span></p>
                      <p className='text-sm pt-0.5'>{getBillingFrequency(selectedDuration)}</p>
                    </div>
                    <div className='flex items-center justify-center'>
                      <Button className="px-3 h-8 bg-lightpurp" onClick={handleSubscribeAndPay}>
                        {localSubscription ? 'Upgrade & Pay' : 'Subscribe & Pay'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p>You are already subscribed to the highest tier and longest duration.</p>
              )}
            </>
          )}
          {dialogState === DialogState.Checkout && (
            <CheckoutContent 
              discountedPrice={discountedPrice}
              selectedTier={selectedTier}
              channelId={channelId}
              selectedDuration={selectedDuration || 'Monthly'}
              onSuccess={handlePaymentSuccess}
              onBack={handleBackToSelection}
              cryptoChargeId={cryptoChargeId}
            />
          )}
          {dialogState === DialogState.HighestTier && (
            <>
              <DialogHeader>
                <DialogTitle className='text-3xl mx-auto font-bold'>
                  You&apos;re on the Highest Tier!
                </DialogTitle>
                <DialogDescription className='mx-auto text-lg'>
                  <div className='flex my-2 justify-center'>
                    <UserAvatar 
                      imageUrl={imageUrl}
                      username={hostName}
                      size="lg"
                      showBadge
                    />
                  </div>
                  <p className='text-white'>You&apos;re already subscribed to the highest tier for {hostName}. Thank you for your support!</p>
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => setIsDialogOpen(false)} className="mt-4">
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};