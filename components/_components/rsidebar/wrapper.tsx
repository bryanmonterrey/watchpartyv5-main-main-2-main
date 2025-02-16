"use client";

import { cn } from "@/lib/utils";
import { useChannelTool } from "@/store/channel-tool-sidebar";
import { useEffect, useState } from "react";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const [isClient, setIsClient] = useState(false);
    const { collapsed } = useChannelTool((state) => state);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return ( 
            <aside 
            className="fixed right-0 flex flex-col w-60 h-[calc(100vh-44px)] bg-appleblack/90 z-50">
            </aside>

        )
    };


    return (
        <aside className={cn(
            "transition-all fixed right-0 flex flex-col lg:w-60 w-[50px] h-[calc(100vh-44px)] bg-appleblack/90 z-50",
            collapsed && "transition-all w-[44px] lg:w-[44px]"
        )}>
            {children}
        </aside>
    );
};