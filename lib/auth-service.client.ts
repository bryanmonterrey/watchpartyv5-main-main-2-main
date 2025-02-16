"use client";

import { useUser } from "@clerk/nextjs";

export const useCurrentUser = () => {
  const { user } = useUser();
  return user;
};
// Add other client-side auth functions here if needed