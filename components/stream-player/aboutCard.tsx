"use client";

import { VerifiedCheck } from "@/components/verified";
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
        <div className="px-2 h-full bottom-5 bg-appleblack/90 rounded-xl ">
            <div className="group h-full bottom-5 rounded-xl bg-appleblack/90 p-4 lg:p-4 flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
                        About {hostName}
                        <VerifiedCheck />
                    </div>
                    {isHost && (
                        <BioModal initialValue={bio}/>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-white">{followedByCount}</span> {followedByLabel}
                </div>
                <p className="text-sm">
                    {bio || ""}
                </p>
            </div>
        </div>
    );
};