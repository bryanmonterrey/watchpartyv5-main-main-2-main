'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const CancelSubscriptionDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  const checkSubscription = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/check-subscription');
      if (!response.ok) {
        throw new Error('Failed to check subscription status');
      }
      const data = await response.json();
      setHasSubscription(data.isSubscribed);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error("Failed to check subscription status.");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSubscription();

    // Recheck subscription when the page is focused
    window.addEventListener('focus', checkSubscription);
    return () => window.removeEventListener('focus', checkSubscription);
  }, []);

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast.success("Subscription cancelled successfully", {
        duration: 3000,
        position: "top-center",
      });

      setIsOpen(false);
      setHasSubscription(false);
      router.refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return <div>Checking subscription status...</div>;
  }

  if (!hasSubscription) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel Subscription</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? This action cannot be undone. You will lose access to premium features at the end of your current billing period.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            No, keep my subscription
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelSubscription}
            disabled={isLoading}
          >
            {isLoading ? 'Cancelling...' : 'Yes, cancel my subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};