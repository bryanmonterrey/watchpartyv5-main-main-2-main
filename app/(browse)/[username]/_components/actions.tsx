"use client";

import { useTransition } from "react";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { onBlock } from "@/actions/block";

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
}

export const Actions = ({
    isFollowing,
    userId,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {

        startTransition(() => {
        onFollow(userId)
            .then((data) => toast.success(`You are now following ${data.following.username}`))
            .catch(() => toast.error("Something went wrong"));
    });
    };

    const handleUnfollow = () => {

        startTransition(() => {
        onUnfollow(userId)
            .then((data) => toast.success(`Unfollowed ${data.following.username}`))
            .catch(() => toast.error("Something went wrong"));
    });
    };

    const onClick = () => {
        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    const handleBlock = () => {
        startTransition(() => {
            onBlock(userId)
            
                .then((data) => toast.success(`Blocked ${data?.blocked?.username || 'user'}`))
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <>
        <Button 
        disabled={isPending} 
        onClick={onClick} 
        variant="primary">
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button onClick={handleBlock} disabled={isPending}>
            block
        </Button>
        </>
    );
};