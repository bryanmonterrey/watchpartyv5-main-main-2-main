// components/pageplayer/variantToggle.tsx

"use client";

import { Users, MessageSquare } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";
import Image from "next/image";

export const VariantToggle = () => {
    const {
        variant,
        onChangeVariant,
    } = useChatSidebar((state) => state);

    const isChat = variant === ChatVariant.CHAT;

    const Icon = isChat ? Users : MessageSquare

    const onToggle = () => {
        const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
        onChangeVariant(newVariant);
    };

    const label = isChat ? "Community" : "Go back to chat";

    return (
        <Hint label={label} placement="left" asChild>
            <Button 
            onClick={onToggle}
            variant="ghost"
            className="h-auto p-1 rounded-lg mt-0.5 hover:bg-white/10 hover:text-primary bg-transparent"
            >
                <Image src="/users2.svg" alt="users" width={20} height={20} />
            </Button>
        </Hint>
    );
};