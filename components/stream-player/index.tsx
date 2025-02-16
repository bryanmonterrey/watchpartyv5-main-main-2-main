"use client";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { User, Stream } from "@prisma/client";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chatToggle";
import { Header, HeaderSkeleton } from "./header";
import { AboutCard } from "./aboutCard";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils"
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { LiveKitRoom } from "@livekit/components-react";
import { Video, VideoSkeleton } from "./video";
import { InfoCard } from "./infoCard";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
};

type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    imageUrl: string;
    stream: CustomStream | null;
    _count: { followedBy: number}
};

interface StreamPlayerProps {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}


export const StreamPlayer = ({
    user,
    stream,
    isFollowing,
}: StreamPlayerProps) => {
    const {
        token,
        name,
        identity,
    } = useViewerToken(user.id);
    const { collapsed } = useChatSidebar((state) => state);

    if (!token || !name || !identity) {
        return <StreamPlayerSkeleton />
    }

    return (
        <div className="h-[calc(100vh-44px)] bg-black flex flex-col"> 
                <div className="h-[calc(100vh-44px)] relative">
                    {collapsed && (
                        <div className="hidden lg:block absolute top-4 right-4 z-50">
                            <ChatToggle />
                        </div>
                    )}
                    <LiveKitRoom 
                        token={token}
                        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                        className={cn(
                            "grid bg-black overflow-y-hidden rounded-xl mb-5 pb-1 gap-x-2 pt-0 pr-2 pl-2 h-full",
                            collapsed ? "grid-cols-1 grid grid-rows-5 h-full p-2 pt-0 md:grid-cols-3 lg:grid-cols-3" : "grid-cols-3 p-2 pt-0 h-full lg:grid-cols-3"
                        )}
                    >
                        <div className="h-full row-span-5 col-span-1 grid grid-rows-[auto_auto_1fr] gap-2">    
    <div>    
        <Video 
            hostName={user.username}
            hostIdentity={user.id}
        />
    </div>  
    <div> 
        <InfoCard 
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
        /> 
    </div>
    <div className="overflow-y-auto">
        <AboutCard 
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio}
            followedByCount={user._count.followedBy}
        />  
    </div> 
</div>
                        <div className={cn(
                            "col-span-1 h-full row-span-5 bottom-0 rounded-sm overflow-hidden",
                            collapsed && "col-span-1  lg:block"
                        )}>
                            <Chat 
                                viewerName={name}
                                hostName={user.username}
                                hostIdentity={user.id}
                                isFollowing={isFollowing}
                                isChatEnabled={stream.isChatEnabled}
                                isChatDelayed={stream.isChatDelayed}
                                isChatFollowersOnly={stream.isChatFollowersOnly}
                            />
                        </div>
                    </LiveKitRoom>
                </div>
            
        </div>
    );
};

export const StreamPlayerSkeleton = () => {
    return (
        <div className="h-full">
            <div className="h-full">
                <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2 p-2">
                    <div className="space-y-4 col-span-1 overflow-y-auto hidden-scrollbar">
                        <VideoSkeleton />
                        <HeaderSkeleton />
                        <VideoSkeleton />
                        <HeaderSkeleton />
                    </div>
                    <div className="col-span-1 overflow-y-auto hidden-scrollbar">
                        <ChatSkeleton />
                    </div>
                    <div className="col-span-1 overflow-y-auto hidden-scrollbar">
                        <ChatSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};
