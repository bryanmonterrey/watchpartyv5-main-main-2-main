// components/pageplayer/actions-bt.tsx

import { ChannelSubscribeButton } from "./_components/channelSubButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import { onFollow, onUnfollow } from "@/actions/follow";
import { toast } from "sonner";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ActionProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
    hostName: string;
    imageUrl: string;
}

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost,
    hostName,
    imageUrl,
}: ActionProps) => {
    const router = useRouter();
    const { userId } = useAuth();
    const [currentSubscription, setCurrentSubscription] = useState<{ tierName: string; price: number } | null>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch(`/api/channel-subscriptions/channel/${hostIdentity}`);
                if (response.ok) {
                    const data = await response.json();
                    setCurrentSubscription(data.subscription);
                }
            } catch (error) {
                console.error("Error fetching subscription:", error);
            }
        };

        if (userId && !isHost) {
            fetchSubscription();
        }
    }, [userId, hostIdentity, isHost]);

    const handleFollow = async () => {
        try {
            const data = await onFollow(hostIdentity);
            toast.success(`You are now following ${data.following.username}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleUnfollow = async () => {
        try {
            const data = await onUnfollow(hostIdentity);
            toast.success(`Unfollowed ${data.following.username}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    
    const toggleFollow = () => {
        if (!userId) {
            return router.push("/sign-in")
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    };

    return (
        <div className="space-x-3 inline-flex">
            <Button
                disabled={isHost}
                onClick={toggleFollow}
                className="h-[34px] px-6 bg-azul text-black hover:bg-[#0054A9] rounded-md"
            >
                <Image src="/broken.svg" width={20} height={20} alt="heart" className={cn(
                    "h-5 w-5",
                    isFollowing ? "fill-white" : "hidden mx-3"
                )}/>
                {isFollowing ? "" : "Follow"}
            </Button>
            <ChannelSubscribeButton 
                channelId={hostIdentity} 
                hostName={hostName} 
                imageUrl={imageUrl}
                currentSubscription={currentSubscription}
                isHost={isHost}
            />
        </div>
    );
};

export const ActionsSkeleton = () => {
    return (
      <Skeleton className="h-10 w-full lg:w-24"/>
    );
};