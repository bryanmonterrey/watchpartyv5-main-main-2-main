// components/pageplayer/chatInfo.tsx

import { useMemo } from "react";
import { Info } from "lucide-react";

import { Hint } from "@/components/hint";

interface ChatInfoProps {
    isDelayed: boolean;
    isFollowersOnly: boolean;
};

export const ChatInfo = ({ isDelayed, isFollowersOnly }: ChatInfoProps) => {
    const hint = useMemo(() => {
        if (isFollowersOnly && !isDelayed) {
            return "Followers only";
        }

        if (isDelayed && !isFollowersOnly) {
            return "Messages are delayed by 3 seconds";
        }

        if (isDelayed && isFollowersOnly) {
            return "Followers only, Messages delayed by 3 seconds";
        }

        return "";
    }, [isDelayed, isFollowersOnly])

    const label = useMemo(() => {
        if (isFollowersOnly && !isDelayed) {
            return "Followers only";
        }

        if (isDelayed && !isFollowersOnly) {
            return "Slow Mode";
        }

        if (isDelayed && isFollowersOnly) {
            return "Followers only & Slow mode";
        }

        return "";
    }, [isDelayed, isFollowersOnly])

        if (!isDelayed && !isFollowersOnly) {
            return null;
        }


    return (
        <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
           <Hint label={hint} asChild>
                <Info className="h-4 w-4" strokeWidth={2.75}/>
           </Hint>
           <p className="text-xs font-semibold">
            {label}
           </p>
        </div>
    );
};

