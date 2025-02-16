import { UserAvatar } from "@/components/useravatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/livebadge";
import Image from "next/image";

interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

export const Thumbnail = ({
  src,
  fallback,
  isLive,
  username,
}: ThumbnailProps) => {
  let content;

  if (!src) {
    content = (
      <div className="bg-appleblack flex aspect-video flex-col items-center rounded-xl justify-center gap-y-4 h-full w-full transition-transform ease-in duration-150 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transiton-colors">
        <UserAvatar
          size="lg"
          showBadge
          username={username}
          imageUrl={fallback}
          isLive={isLive}
        />
      </div>
    );
  } else {
    content = (
      <Image
        src={src}
        fill
        alt="thumbnail"
        className="object-cover transition-transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 rounded-sm ease-in"
      />
    );
  }

  return (
    <div className="group aspect-video relative cursor-pointer bg-transparent  rounded-xl stream overflow-visible">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-colors rounded-xl flex items-center justify-center z-10" />
      
      {/* Content wrapper */}
      <div className="absolute inset-0 z-30">
        {content}
      </div>
      
      {isLive && src && (
        <div className="absolute top-2 left-2 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-150 z-40">
          <LiveBadge />
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 hidden w-[9px] h-2 ease-in -rotate-45 z-20 bg-inherit transform scale-0 group-hover:scale-100 origin-top-left transition-transform duration-150" />
      <div className="absolute bottom-0 right-0 hidden w-2.5 h-[9px] ease-in z-20 rotate-45 bg-inherit transform scale-0 group-hover:scale-100 origin-bottom-right transition-transform duration-150" />
    </div>
  );
};

export const ThumbnailSkeleton = () => {
  return (
    <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="h-full w-full bg-buttongray/70" />
    </div>
  );
};