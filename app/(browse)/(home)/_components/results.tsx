import { GetStreams } from "@/lib/feedService";
import { ResultCard, ResultCardSkeleton } from "./resultCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Results = async () => {
    const data = await GetStreams();

    return (
        <div>
            <h2 className="text-xl -ml-2 text-litewhite font-semibold mb-6">
                    Streams we think you&apos;ll like
            </h2>
            {data.length === 0 && (
                <div className="text-muted-foreground text-sm">
                    no streams found
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                {data.map((result) => (
                    <ResultCard
                        key={result.id}
                        data={result}
                    />
                ))}
            </div>
        </div>
    )
}

export const ResultsSkeleton = () => {
    return (
        <div>
            <Skeleton className="h-2 w-[290px] mb-4 bg-buttongray"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[...Array(4)].map((_, i) => (
                    <ResultCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};