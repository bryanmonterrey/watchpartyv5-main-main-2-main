"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loadStripe, StripeError, PaymentMethod } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function UpdatePaymentForm({ subscriptionId, onSuccess }: { subscriptionId: string, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement('card')!,
      });

      if (error) {
        throw error;
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // If successful, update the subscription with the new payment method
      const response = await fetch('/api/channel-subscriptions/update-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId, 
          paymentMethodId: paymentMethod.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription payment method');
      }

      toast.success('Payment method updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update payment method. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? 'Updating...' : 'Update Payment Method'}
      </Button>
    </form>
  );
}

interface EditPaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
}

export function EditPaymentMethodDialog({ isOpen, onClose, subscriptionId }: EditPaymentMethodDialogProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientSecret = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/channel-subscriptions/edit-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client secret');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
      toast.error('Failed to initiate payment method update');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClientSecret();
    }
  }, [isOpen, clientSecret]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>Loading...</div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <UpdatePaymentForm subscriptionId={subscriptionId} onSuccess={onClose} />
          </Elements>
        ) : (
          <div>Failed to load payment form. Please try again.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}