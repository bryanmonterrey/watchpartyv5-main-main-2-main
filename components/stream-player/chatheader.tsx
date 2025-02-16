"use client";

import { Skeleton } from "../ui/skeleton";
import { ChatToggle } from "./chatToggle";
import { VariantToggle } from "./variantToggle";

export const ChatHeader = () => {
    return (
        <div className="relative px-2.5 py-0 flex items-center justify-between rounded-t-xl">
            <div className="left-2 lg:block">
            <ChatToggle />
            </div>
            <div>
            <p className="font-medium text-center text-xs text-white/80">
            Chat
            </p>
            </div>
            <div className="right-2">
                <VariantToggle />
            </div>
        </div>
    );
};

export const ChatHeaderSkeleton = () => {
    return (
        <div className="relative p-3 border-b hidden md-block">
            <Skeleton className="absolute h-6 w-6 left-3 top-3"/>
            <Skeleton className="w-28 h-6 mx-auto" />
        </div>
    )
}