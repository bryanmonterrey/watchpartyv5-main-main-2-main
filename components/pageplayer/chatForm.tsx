// components/pageplayer/chatForm.tsx

"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ArrowUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInfo } from "./chatInfo";
import Image from "next/image";

interface ChatFormProps {
    onSubmit: () => void;
    value: string;
    onChange: (value: string) => void;
    isHidden: boolean;
    isFollowersOnly: boolean;
    isFollowing: boolean;
    isDelayed: boolean;
};

export const ChatForm = ({
    onSubmit,
    value,
    onChange,
    isHidden,
    isFollowersOnly,
    isFollowing,
    isDelayed,
}: ChatFormProps) => {
 const [isDelayBlocked, setIsDelayBlocked] = useState(false);

 const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
 const isDisabled = isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
        setIsDelayBlocked(true);
        setTimeout(() => {
            setIsDelayBlocked(false);
            onSubmit();
        }, 3000);
    } else {
        onSubmit();
    }
 }

 if(isHidden) {
    return null;
 }

    return (
        <div className="h-24 w-full space-y-4">
            <div className="z-[50] flex-grow flex items-center justify-center">
                <div className="w-full mx-1.5 transition-all ease-in-out duration-200 bg-black rounded-full border-3 border-transparent focus-within:bg-black focus:bg-black hover:bg-black focus-within:border-3 focus-within:border-white/80 hover:border-3 hover:border-buttongray focus-within:hover:border-white/80">
                    <form 
                    onSubmit={handleSubmit} 
                    className="inline-flex items-center w-full justify-center relative p-0"
                    >
                            <Input 
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                            disabled={isDisabled}
                            placeholder="send a message..."
                            className={cn(
                            "border-none text-[15px] h-[36px] bg-transparent font-regular placeholder:text-[#9b9b9b] w-full py-0 focus-visible:ring-none",
                            isFollowersOnly && ""
                        )}
                    />
                            <Button
                            className="py-0.5 h-6 w-6 px-1 mr-1.5 ml-auto rounded-full"
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isDisabled}
                            >
                                <ArrowUp className="h-4 w-4 text-white/90" strokeWidth={3}/>
                            </Button>
                            
                    </form>
                </div>
            </div>
            <div className="mr-4 flex h-5">
                <div>
                    <ChatInfo 
                        isDelayed={isDelayed}
                        isFollowersOnly={isFollowersOnly}
                        />
                </div>
                <div className="ml-auto">
                    <Button className="h-7 bg-transparent hover:bg-transparent ml-auto text-white">
                        <Image src="/settings.svg" alt="settings" width={20} height={20} className=" text-black fill-white"/>
                    </Button>
                </div>       
            </div>
        </div>
    );
};

export const ChatFormSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-y-4 p-3">
            <Skeleton className="w-full h-10"/>
            <div className="flex items-center gap-x-2 ml-auto">
                <Skeleton className="h-7 w-7"/>
                <Skeleton className="h-7 w-12" />
            </div>
        </div>
    )
}