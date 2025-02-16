import { Skeleton } from "@/components/ui/skeleton"

export const Hero = () => {
    return (
        <div className="w-full grid grid-cols-12 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 -space-x-24 2xl:grid-cols-12 pr-15 pl-14 gap-x-1 justify-center items-center">
            <div className="col-span-9 ml-10  h-[calc(100%-4rem)] rounded-xl aspect-video bg-black ">
            </div>
            <div className="col-span-3 w-full h-[calc(100%-4rem)] rounded-xl bg-black">
            </div>
        </div>
    )
}

export const HeroSkeleton = () => {
    return (
        <div className="w-full grid grid-cols-12 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 -space-x-24 2xl:grid-cols-12 pr-15 pl-14 gap-x-1 justify-center items-center">
            <Skeleton className="w-full h-full bg-buttongray/75" />
            <div className="col-span-9 ml-10 h-[calc(100%-4rem)] rounded-xl aspect-video">
                <Skeleton className="w-full h-full bg-buttongray/75" />
            </div>
            <div className="col-span-3 w-full h-[calc(100%-4rem)] rounded-xl">
                <Skeleton className="w-full h-full bg-buttongray/75" />
            </div>
        </div>
    )
}