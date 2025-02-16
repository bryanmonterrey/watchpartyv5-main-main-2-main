import { currentUser } from '@clerk/nextjs/server';
import { getSubscriptionStatus } from '@/lib/auth-service';

export const getServerActionData = async () => {
  const user = await currentUser();
  const subscriptionStatus = user ? await getSubscriptionStatus() : null;

  return {
    user,
    subscriptionStatus,
  };
};