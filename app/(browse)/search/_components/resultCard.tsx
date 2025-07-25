import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { VerifiedCheck } from "@/components/verified";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Stream, User } from "@prisma/client";
import { Link } from 'next-view-transitions'

interface ResultCardProps {
    data: {
        name: string;
        id: string;
        thumbnailUrl: string | null;
        isLive: boolean;
        updatedAt: Date;
        user: User;
    }
};

export const ResultCard = ({
    data,
}: ResultCardProps) => {
    return (
        <Link href={`/${data.user.username}`}>
            <div className="w-full flex gap-x-4">
                <div className="relative h-[9rem] w-[16rem] ">
                    <Thumbnail
                    src={data.thumbnailUrl}
                    fallback={data.user.imageUrl}
                    isLive={data.isLive}
                    username={data.user.username}

                    />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold text-lg cursor-pointer hover:text-lightpurp">
                            {data.user.username}
                        </p>
                        <VerifiedCheck />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {data.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(data.updatedAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export const ResultCardSkeleton = () => {
    return (
        <div className="w-full flex gap-x-4">
            <div className="relative h-[9rem] w-[16rem]">
                <ThumbnailSkeleton />
            </div>
            <div className="space-y-2 ">
                <Skeleton className="h-4 w-32"/>
                <Skeleton className="h-3 w-24"/>
                <Skeleton className="h-3 w-12"/>
            </div>
        </div>
    );
};