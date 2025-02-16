"use client";

import { useSidebar } from '@/store/use-sidebar';
import { User } from '@prisma/client'
import React from 'react'
import { UserItem, UserItemSkeleton } from './useritem';
import { Crown, Activity } from 'lucide-react';
import Image from 'next/image';
import Hint from '@/components/hint';

interface RecommendedProps {
    data: (User & {
        stream: { isLive: boolean } | null;
    })[];
};

const Recommended = ({
    data,
}: RecommendedProps) => {
    const { collapsed } = useSidebar((state) => state);


    const showLabel = !collapsed && data.length > 0;

  return (
    <div >
        {showLabel && (
            <div className="flex w-full justify-start mr-auto items-start pl-3 mb-3">
                <p className="w-full flex justify-start items-start text-sm font-medium text-litewhite">
                    trending
                </p>
            </div> 
        )}
        {collapsed && (
            <Hint label='Trending' placement='right' asChild>
                <div className="flex justify-center items-center mb-2">
                    <Activity className='h-4 w-4 text-litepurp' strokeWidth={3.35}/>
                </div>
            </Hint>
            )}
        <div className='flex items-center justify-center w-full'>
        <ul className="px-1 w-full">
            {data.map((user) => (
                <UserItem 
                 key={user.id}
                 username={user.username}
                 imageUrl={user.imageUrl} 
                 isLive={user.stream?.isLive}
                />
            ))}
        </ul>
        </div>
        </div>
  )
}

export default Recommended

export const RecommendedSkeleton = () => {
    return (
        <ul className='space-y-0 pl-0.5'>
            {[...Array(11)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}

        </ul>
    ) 
}