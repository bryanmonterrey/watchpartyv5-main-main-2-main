// components/pageplayer/index.tsx
"use client";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { User, Stream } from "@prisma/client";
import { Chat } from "./chat";
import { ExpandToggle } from "./chatToggle";
import { Header} from "./header";
import { AboutCard } from "./aboutCard";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { LiveKitRoom } from "@livekit/components-react";
import { Video} from "./video";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="h-full hidden-scrollbar">
            <LiveKitRoom 
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className="h-full"
            >
                <div className="h-full relative">
                    <motion.div 
                        className="h-full"
                        animate={{
                            paddingRight: collapsed ? 0 : 340
                        }}
                        transition={{ duration: 0.20 }} 
                    >   
                        <div className="space-y-2 bg-[#0C0C0D] h-screen rounded-t-xl">
                            <Video 
                                hostName={user.username}
                                hostIdentity={user.id}
                            />
                            <Header 
                                hostName={user.username}
                                hostIdentity={user.id}
                                viewerIdentity={identity}
                                imageUrl={user.imageUrl}
                                isFollowing={isFollowing}
                                name={stream.name}
                            />
                            <AboutCard 
                                hostName={user.username}
                                hostIdentity={user.id}
                                viewerIdentity={identity}
                                bio={user.bio}
                                followedByCount={user._count.followedBy}
                            />
                        </div>
                    </motion.div>
                    <AnimatePresence>
                        {!collapsed ? (
                            <motion.aside
                                key="chat"
                                initial={{ x: 340 }}
                                animate={{ x: 0 }}
                                exit={{ x: 340 }}
                                transition={{ duration: 0.20, ease: "easeInOut" }}
                                className="fixed bottom-0 right-0 w-[340px] h-full"
                            >
                                <Chat 
                                    viewerName={name}
                                    hostName={user.username}
                                    hostIdentity={user.id}
                                    isFollowing={isFollowing}
                                    isChatEnabled={stream.isChatEnabled}
                                    isChatDelayed={stream.isChatDelayed}
                                    isChatFollowersOnly={stream.isChatFollowersOnly}
                                />
                            </motion.aside>
                        ) : (
                            <motion.div
                                key="toggle"
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="fixed top-4 right-4 z-50 mt-[44px]"
                            >
                                <ExpandToggle />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LiveKitRoom>
        </div>
    );
};

export const StreamPlayerSkeleton = () => {
    return (
        <div className="h-full">
        </div>
    );
};