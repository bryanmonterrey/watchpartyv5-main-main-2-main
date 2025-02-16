"use client";

import Image from "next/image";
import { InfoModal } from "./infoModal";
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface InfoCardProps {
    name: string;
    thumbnailUrl: string | null;
    hostIdentity: string;
    viewerIdentity: string;
};

export const InfoCard = ({
    name,
    thumbnailUrl,
    hostIdentity,
    viewerIdentity,
}: InfoCardProps) => {
    const hostAsViewer = `host-${hostIdentity}`;
    const isHost = viewerIdentity === hostAsViewer;

    if (!isHost) return null;

    return (
        <div className="px-2 rounded-sm bg-[#1c1b1e]">
            <div className=" bg-[#1c1b1e]">
                <div className="flex items-center gap-x-2.5 p-2">
                    <div>
                        <h2 className="text-sm lg:text-sm font-semibold capitalize">
                            Edit your stream 
                        </h2>
                    </div>
                    <InfoModal 
                    initialName={name}
                    initialThumbnailUrl={thumbnailUrl}
                    />
                </div>
                <Separator />
                <div className="p-2 lg:p-2 space-y-4">
                    <div>
                        <h3 className="text-sm text-muted-foreground mb-2">
                            Name
                        </h3>
                        <p className="text-sm font-semibold">
                            {name}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm text-muted-foreground mb-2">
                            Thumbnail
                        </h3>
                        {thumbnailUrl && (
                            <div className="relative aspect-video rounded-md overflow-hidden w-[50px] h-[50px] border border-white/10">
                                <Image 
                                fill
                                src={thumbnailUrl}
                                alt={name}
                                className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};