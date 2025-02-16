// components/pageplayer/offline-video.tsx

interface OfflineVideoProps {
    username: string,
};

export const OfflineVideo = ({
    username,
}: OfflineVideoProps) => {
    return (
        <div className="h-full py-9 flex flex-col bg-[url('/n3on.jpeg')] bg-center rounded-xl space-y-4 justify-center items-start pl-10">
            <div className="bg-[#191b1fcc] pl-7 py-6 rounded-lg h-[50%] w-[35%] gap-y-0.5 top-4 flex flex-col items-start justify-start">
            <div className="w-18 text-[10px] font-bold rounded-[3px] px-1.5 py-0.5 text-black bg-white">
                OFFLINE
            </div>
            <p className="text-white font-semibold text-4xl sm:text-2xl">
                {username} is offline.
            </p>
            </div>
        </div>
    )
}