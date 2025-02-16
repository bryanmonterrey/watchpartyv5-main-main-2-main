"use client";

import { ConnectionState, Track } from "livekit-client";
import {
    useConnectionState,
    useRemoteParticipant,
    useTracks,
} from "@livekit/components-react"
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatToggle } from "./chatToggle";
import { VariantToggle } from "./variantToggle";

interface VideoProps {
    hostName: string;
    hostIdentity: string;
};

export const Video = ({
    hostName,
    hostIdentity,
}: VideoProps) => {
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone,
    ]).filter((track) => track.participant.identity === hostIdentity);

    let content;

    if (!participant && connectionState === ConnectionState.Connected) {
        content = <OfflineVideo username={hostName}/>;
    } else if (!participant || tracks.length === 0) {
        content = <LoadingVideo label={connectionState} />;
    } else {
        content = <LiveVideo participant={participant} />
    };

    return (
        <div className="bg-appleblack/90 rounded-t-xl">
        <div className="relative px-3 py-0 flex items-center justify-between rounded-t-xl">
        <div className="left-2 lg:block">
            <ChatToggle />
            </div>
            <div>
            <p className="font-medium text-center text-xs text-white/80">
            Stream Preview
            </p>
            </div>
            <div className="right-2">
                <VariantToggle />
            </div>
        </div>
        <div className="aspect-video rounded-sm group relative">
            {content}
        </div>
        </div>
    );
};

export const VideoSkeleton = () => {
    return (
        <div className="aspect-video rounded-lg">
            <Skeleton className="h-full w-full rounded-lg" />
        </div>
    );
};