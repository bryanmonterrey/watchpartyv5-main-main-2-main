import { Skeleton } from "@/components/ui/skeleton";
import { ToggleCardSkeleton } from "./_components/toggle-card";

const ChatLoading = () => {
    return (
        <div className="p-6 space-y-2">
            <Skeleton className="h-10 w-[200px]"/>
            <div className="space-y-2">
                <ToggleCardSkeleton />
                <ToggleCardSkeleton />
                <ToggleCardSkeleton />
            </div>
        </div>
    );
};

export default ChatLoading;