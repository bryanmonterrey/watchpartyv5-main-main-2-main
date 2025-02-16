// components/pageplayer/chatMessage.tsx

"use client";

import { format } from "date-fns";
import { ReceivedChatMessage } from "@livekit/components-react";

import { stringToColor } from "@/lib/utils";

interface ChatMessageProps {
    data: ReceivedChatMessage;
};

export const ChatMessage = ({
    data,
}: ChatMessageProps) => {
    const color = stringToColor(data.from?.name || "");

    return (
        <div className="transition-all ease-in-out duration-700 flex gap-2 py-1.5 px-2 rounded-sm hover:bg-white/5 ">
            
            <div className="flex flex-wrap font-bold text-[15px] items-baseline gap-1 grow">
            
                <span className="text-xs font-semibold">
                <span className="text-xs text-white/40">
                {format(data.timestamp, "HH:MMa")}
            </span> <span />
                    <span className="text-[15px] hover:bg-white/15 rounded-[2px] text-white cursor-pointer font-semibold truncate" style={{ color: color}}>
                        {data.from?.name}
                    </span><span className="text-[15px]">:</span> <span />
                    <span className="text-[15px] font-normal break-all ">
                    {data.message}
                </span>
                </span>
                
            </div>
        </div>
    );
};