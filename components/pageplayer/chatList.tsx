// components/pageplayer/chatList.tsx

"use client";

import { ReceivedChatMessage } from "@livekit/components-react";
import { ChatMessage } from "./chatMessage";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
    messages: ReceivedChatMessage[];
    isHidden: boolean;
};

export const ChatList = ({
    messages,
    isHidden,
}: ChatListProps) => {
    if (isHidden || !messages || messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
                </p>
            </div>
        )
    }

    return (
        <div className="transition-all ease-soft-spring flex flex-1 flex-col-reverse overflow-y-auto p-1 h-auto">
            {messages.map((message) => (
                <ChatMessage
                key={message.timestamp} 
                data={message}
                />
            ))}
        </div>
    );
};

export const ChatListSkeleton = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <Skeleton className="w-1/2 h-6"/>
        </div>
    )
}