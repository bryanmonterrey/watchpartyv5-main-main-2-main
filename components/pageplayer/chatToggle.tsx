"use client";

import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebar";

export const ExpandToggle = () => {
    const { onExpand } = useChatSidebar((state) => state);

    return (
        <Hint label="Expand" placement="bottom" asChild>
            <Button 
                onClick={onExpand}
                variant="ghost"
                className="h-auto w-auto p-1.5 rounded-lg hover:bg-white/10 bg-transparent text-white/80 hover:text-white"
            >
                <div className='bg-black hover:bg-zinc-900 px-2 py-1 rounded-lg inline-flex items-center justify-center gap-x-1'>
                    <ArrowLeft
                        className='text-inherit'
                        width={16}
                        height={16}
                        strokeWidth={3}
                    />
                    Chat
                </div>
            </Button>
        </Hint>
    );
};

export const CollapseToggle = () => {
    const { onCollapse } = useChatSidebar((state) => state);

    return (
        <Hint label="Collapse" placement="bottom" asChild>
            <Button 
                onClick={onCollapse}
                variant="ghost"
                className="h-auto w-auto p-1.5 rounded-lg hover:bg-white/10 bg-transparent text-white/80 hover:text-white"
            >
                <ChevronRight
                    className='text-inherit'
                    width={16}
                    height={16}
                    strokeWidth={3}
                />
            </Button>
        </Hint>
    );
};