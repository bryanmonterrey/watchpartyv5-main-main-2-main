"use client";

import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useChannelTool } from '@/store/channel-tool-sidebar';
import React from 'react'

interface ContainerProps {
    children: React.ReactNode;
};

const Container = ({
  children,
}: ContainerProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const {
        collapsed,
        onCollapse,
        onExpand,
    } = useChannelTool((state) => state);

    useEffect(() => {
        if (matches) {
            onCollapse();
        } else {
            onExpand();
        }
    }, [matches, onCollapse, onExpand]); 

  return (
    <div className={cn(
        "flex-1 rounded-r-[15px] transition",
        collapsed ? "": "transition"
    )}>
        {children}
    </div>
  )
}

export default Container