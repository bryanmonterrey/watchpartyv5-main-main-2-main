// app/(dashboard)/u/[username]/subscription/_components/CancelChannelSubscriptionButton.tsx

"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CancelChannelSubscriptionButtonProps {
  subscriptionId: string;
  status: string;
  paymentMethod: 'stripe' | 'crypto';
  onCancel: (subscriptionId: string) => void;
}

export function CancelChannelSubscriptionButton({ 
  subscriptionId, 
  status, 
  paymentMethod,
  onCancel 
}: CancelChannelSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/channel-subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      toast.success("Subscription cancelled successfully")
      onCancel(subscriptionId)
    } catch (error) {
      toast.error("Failed to cancel subscription")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'canceled' || paymentMethod === 'crypto') {
    return null; // Don't show button for canceled or crypto subscriptions
  }

  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      variant="destructive"
      size="sm"
    >
      {isLoading ? "Cancelling..." : "Cancel Subscription"}
    </Button>
  )
}