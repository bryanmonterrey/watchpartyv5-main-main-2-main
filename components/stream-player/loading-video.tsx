import { Loader } from "lucide-react";
import Image from "next/image";

interface LoadingVideoProps {
    label: string,
};

export const LoadingVideo = ({
    label,
}: LoadingVideoProps) => {
    return (
        <div className="h-full flex flex-col space-y-4 justify-center items-center">
            <Image src="/load.svg" alt="loading" width={40} height={40}  className="h-10 w-10 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground font-semibold capitalize">
                {label}
            </p>
        </div>
    )
}