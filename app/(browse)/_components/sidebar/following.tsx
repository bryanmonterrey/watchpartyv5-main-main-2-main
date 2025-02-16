"use client";

import { useSidebar } from "@/store/use-sidebar";
import { Follow, User } from "@prisma/client";
import { UserItem, UserItemSkeleton } from "./useritem";
import { Heart } from 'lucide-react';
import Hint from "@/components/hint";

interface FollowingProps {
    data: (Follow & { 
        following: User & {
        stream: { isLive: boolean } | null;
    },
 })[];
}

export const Following = ({
    data,
}: FollowingProps) => {
    const { collapsed } = useSidebar((state) => state);

    if (!data.length) {
        return null;
    }

    return (
        <div>
            {!collapsed && (
                <div className="pl-3 mb-3">
                    <p className="text-sm font-semibold text-litewhite">
                        following
                    </p>
                </div>
            )}
            {collapsed && (
                <Hint label='Following' placement='right' asChild>
                <div className="flex justify-center items-center pt-[2px] mb-2">
                    <Heart className="h-[18px] w-[18px] text-litepurp" strokeWidth={3}/>
                </div>
                </Hint>
            )}
            <div className='flex items-center justify-center w-full'>
            <ul className="w-full px-1">
                {data.map((follow) => (
                    <UserItem 
                    key={follow.following.id}
                    username={follow.following.username}
                    imageUrl={follow.following.imageUrl}
                    isLive={follow.following.stream?.isLive}
                    />
                ))}
            </ul>
            </div>
        </div>
    );
};

export const FollowingSkeleton = () => {
    return (
        <ul className="pl-0.5 pt-2 lg:pt-0">
            {[...Array(3)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}
        </ul>
    );
};