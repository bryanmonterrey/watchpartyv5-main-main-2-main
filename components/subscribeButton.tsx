'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  priceId: string;
  onSubscriptionComplete: (data: any) => void;
}

function CheckoutForm({ priceId, onSubscriptionComplete }: SubscribeButtonProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { clientSecret, customerId, subscriptionId } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSubscriptionComplete({
        customerId,
        subscriptionId,
        priceId
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="pt-4" onSubmit={handleSubmit}>
      <CardElement />
      <div className='flex items-center'>
      <Button type="submit" disabled={isLoading} className="mt-8 mx-auto h-8 bg-lightpurp hover:bg-lightpurp/70 px-3">
        {isLoading ? 'Processing...' : 'Confirm Purchase'}
      </Button>
      </div>
    </form>
  );
}

export function SubscribeButton({ priceId, onSubscriptionComplete }: SubscribeButtonProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm priceId={priceId} onSubscriptionComplete={onSubscriptionComplete} />
    </Elements>
  );
}