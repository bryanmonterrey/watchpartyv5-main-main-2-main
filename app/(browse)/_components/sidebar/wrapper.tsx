// app/(browse)/_components/sidebar/wrapper.tsx

"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./recommended";
import { FollowingSkeleton } from "./following";

interface WrapperProps {
    children: React.ReactNode
}

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const [isClient, setIsClient] = useState(false);
    const { collapsed } = useSidebar((state) => state);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return ( 
            <aside 
            className="fixed left-0 flex flex-col w-[44px] h-full z-[1000] bg-opacity-80">
                <ToggleSkeleton />
                <FollowingSkeleton />
                <RecommendedSkeleton />
            </aside>
        )
    };

    return (
        <motion.aside 
            className={cn(
                "fixed left-0 z-[1000] flex-col w-60 h-full",
                collapsed && "w-[44px]"
            )}
            initial={{ width: collapsed ? 44 : 240 }}
            animate={{ width: collapsed ? 44 : 240 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
        >
            {children}
        </motion.aside>
    );
};