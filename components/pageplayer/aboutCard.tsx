// components/pageplayer/aboutCard.tsx

"use client";

import { BioModal } from "./bioModal";

interface AboutCardProps {
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    bio: string | null;
    followedByCount: number;
};

export const AboutCard = ({
    hostName,
    hostIdentity,
    viewerIdentity,
    bio,
    followedByCount,
}: AboutCardProps) => {
    const hostAsViewer = `host-${hostIdentity}`;
    const isHost = viewerIdentity === hostAsViewer;

    const followedByLabel = followedByCount === 1 ? "follower" : "followers";

    return (
        <div className="px-4 py-2 rounded-xl">
            <div className="group rounded-xl bg-[#090909] p-2 lg:p-5 flex flex-col gap-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 font-bold text-lg lg:text-[26px]">
                        About {hostName}
                    </div>
                    {isHost && (
                        <BioModal initialValue={bio}/>
                    )}
                </div>
                <div className="text-base text-muted-foreground font-semibold">
                    <span className="font-bold text-white">{followedByCount}</span> {followedByLabel}
                </div>
                <p className="text-base text-white">
                    {bio || ""}
                </p>
            </div>
        </div>
    );
};