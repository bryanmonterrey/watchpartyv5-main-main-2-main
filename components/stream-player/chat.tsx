"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionState } from "livekit-client";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";
import { useChat, useConnectionState, useRemoteParticipant } from "@livekit/components-react";
import { useMediaQuery } from "usehooks-ts"
import { ChatHeader, ChatHeaderSkeleton } from "./chatheader"
import { ChatForm, ChatFormSkeleton } from "./chatForm"
import { ChatList, ChatListSkeleton } from "./chatList"
import { ChatCommunity } from "./chatCommunity";


interface ChatProps {
    hostName: string,
    hostIdentity: string,
    viewerName: string,
    isFollowing: boolean,
    isChatEnabled: boolean,
    isChatDelayed: boolean,
    isChatFollowersOnly: boolean,
}

export const Chat = ({
    hostName,
    hostIdentity,
    viewerName,
    isFollowing,
    isChatEnabled,
    isChatDelayed,
    isChatFollowersOnly,
}: ChatProps) => {
    const matches = useMediaQuery('(max-width: 1024px)');
    const { variant, onExpand } = useChatSidebar((state) => state);
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);

    const isOnline = participant && connectionState === ConnectionState.Connected

    const isHidden = !isChatEnabled || !isOnline;

    const [value, setValue] = useState("");
    const { chatMessages: messages, send } = useChat();

    useEffect(() => {
        if (matches) {
            onExpand();
        }
    }, [matches, onExpand]);

    const reversedMessages = useMemo(() => {
        return messages.sort((a, b) => b.timestamp - a.timestamp);
    }, [messages])

    const onSubmit = () => {
        if (!send) return;

        send(value);
        setValue("");
    };

    const onChange = (value: string) => {
        setValue(value);
    };


    return (
        <div className="flex flex-col bg-appleblack/90 rounded-xl h-full">
            <ChatHeader />
            {variant === ChatVariant.CHAT && (
                <>
                <ChatList
                messages={reversedMessages}
                isHidden={!isChatEnabled}
                />
                <ChatForm
                onSubmit={onSubmit}
                value={value}
                onChange={onChange}
                isHidden={!isChatEnabled}
                isFollowersOnly={isChatFollowersOnly}
                isDelayed={isChatDelayed}
                isFollowing={isFollowing}
                />
                </>
            )}
            {variant === ChatVariant.COMMUNITY && (
                <ChatCommunity
                viewerName={viewerName}
                hostName={hostName}
                isHidden={!isChatEnabled}
                />
                )}
        </div>
    );
};

export const ChatSkeleton = () => {
    return (
        <div className="flex flex-col bg-buttongray/90 animate-pulse rounded-lg pt-0 h-full ">
            <ChatHeaderSkeleton />
            <ChatListSkeleton />
            <ChatFormSkeleton />
        </div>
    );
};