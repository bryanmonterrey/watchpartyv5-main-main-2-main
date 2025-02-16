// lib/client-subscription-status.ts
"use client";

import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  isSubscribed: boolean;
}

export const useSubscriptionStatus = () => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/get-subscription-status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        } else {
          console.error('Failed to fetch subscription status:', response.statusText);
          setError(`Failed to fetch subscription status: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setError('Error fetching subscription status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return { status, error, isLoading };
};