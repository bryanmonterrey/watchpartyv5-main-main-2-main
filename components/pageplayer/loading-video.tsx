// components/pageplayer/loading-video.tsx

import { Loader } from "lucide-react";
import Image from "next/image";

interface LoadingVideoProps {
    label: string,
};

export const LoadingVideo = ({
    label,
}: LoadingVideoProps) => {
    return (
        <div className="h-full py-9 flex flex-col animate-pulse bg-buttongray/30 bg-center rounded-xl space-y-4 justify-center items-start pl-10">
            <div className="bg-[#191b1fcc] opacity-0 pl-7 py-6 rounded-lg h-[50%] w-[35%] gap-y-0.5 top-4 flex flex-col items-start justify-start">
            <div className="w-18 text-[10px] font-bold rounded-[3px] px-1.5 py-0.5 text-black bg-white">
                OFFLINE
            </div>
            <p className="text-white font-semibold text-4xl sm:text-2xl">
                 is offline.
            </p>
            </div>
        </div>
    )
}