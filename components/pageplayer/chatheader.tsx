"use client";

import { Skeleton } from "../ui/skeleton";
import { CollapseToggle } from "./chatToggle";
import { VariantToggle } from "./variantToggle";

export const ChatHeader = () => {
    return (
        <div className="relative px-2.5 py-0 flex items-center justify-between">
            <div className="hidden lg:block">
                <CollapseToggle />
            </div>
            <div className="m-auto">
                <p className="font-semibold text-sm text-white text-center">
                    chat
                </p>
            </div>
            <div className="">
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
};
