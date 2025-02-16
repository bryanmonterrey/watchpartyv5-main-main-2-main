"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
}

export const ToggleCard = ({
    label,
    value = false,
    field,
}: ToggleCardProps ) => {
    const [isPending, startTransition] = useTransition();

    const onChange = () => {
         startTransition(() => {
            updateStream({ [field]: !value })
            .then(() => toast.success("Chat settings updated!"))
            .catch(() => toast.error("Something went wrong"));
        }); 
    };



    return (
        <div className="rounded-sm bg-studioblack p-2">
            <div className="flex items-center justify-between">
                <p className="font-medium text-[15px] shrink-0">
                    {label}
                </p>
                <div className="space-y-2 ">
                    <Switch 
                        className="h-5"
                        disabled={false}
                        onCheckedChange={onChange}
                        checked={value}
                    >
                        {value ? "On" : "Off"}
                    </Switch>
                    

                </div>
            </div>
        </div>
    );
};

export const ToggleCardSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    )
}