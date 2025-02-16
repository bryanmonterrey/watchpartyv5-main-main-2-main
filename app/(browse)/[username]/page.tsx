import { isFollowingUser } from '@/lib/follow-service';
import { getUserByUsername } from '@/lib/user-service';
import { isBlockedByUser } from '@/lib/block-service';
import { notFound } from "next/navigation"
import React from 'react'
import { StreamPlayer } from '@/components/pageplayer';

interface UserPageProps {
    params: {
        username: string;
    };
};

export const generateMetadata = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);
  
  if (!user) {
    return {
      title: 'User Not Found'
    };
  }

  return {
    title: `${user.username}`,
  };
};

const UserPage = async ({
    params
}: UserPageProps) => {
    const user = await getUserByUsername(params.username);

    if (!user || !user.stream) {
        notFound();
    }

    const isFollowing = await isFollowingUser(user.id);
    const isBlocked = await isBlockedByUser(user.id);

    if (isBlocked) {
        notFound();
    }

  return (
    <StreamPlayer 
    user={user}
    stream={user.stream}
    isFollowing={isFollowing}
    />

  )
}

export default UserPage