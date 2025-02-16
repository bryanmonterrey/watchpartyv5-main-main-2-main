// lib/auth-service.server.ts

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({ 
    where: { externalUserId: self.id },
    select: {
      id: true,
      username: true,
      email: true,
      imageUrl: true,
      externalUserId: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      subscription: {
        select: {
          stripeCustomerId: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("Not found");
  }

  return {
    ...user,
    stripeCustomerId: user.subscription?.stripeCustomerId
  };
};

export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  } 

  const user = await db.user.findUnique({ 
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      imageUrl: true,
      externalUserId: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (self.username !== user.username) {
    throw new Error("Unauthorized");
  }

  return user;
}

export const getSubscriptionStatus = async () => {
  const self = await currentUser();

  if (!self || !self.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
    select: {
      subscription: {
        select: {
          status: true,
          stripeCurrentPeriodEnd: true
        }
      }
    }
  });

  if (!user?.subscription) {
    return {
      isSubscribed: false,
      isCanceled: false,
      isActive: false
    };
  }

  const isActive = user.subscription.status === "active";
  const isCanceled = user.subscription.status === "canceled";
  const isSubscribed = isActive && !isCanceled;

  return {
    isSubscribed,
    isCanceled,
    isActive,
    expirationDate: user.subscription.stripeCurrentPeriodEnd
  };
};