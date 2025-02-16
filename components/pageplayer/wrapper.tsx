// components/pageplayer/wrapper.tsx

"use client";

import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { MotionAside } from "../ClientMotion";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const { collapsed } = useChatSidebar((state) => state);

    return (
        <MotionAside className={cn(
            "transition-all ease-in-out fixed right-0 flex flex-col bottom-0 pt-[46px] w-[340px] lg:w-[340px] h-full z-50",
            collapsed && "transition-all ease-in-out lg:w-[340px]"
        )}>
            {children}
        </MotionAside>
    );
};