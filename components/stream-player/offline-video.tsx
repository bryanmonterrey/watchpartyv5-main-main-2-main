

interface OfflineVideoProps {
    username: string,
};

export const OfflineVideo = ({
    username,
}: OfflineVideoProps) => {
    return (
        <div className="h-full flex flex-col bg-[#FF2D49] space-y-4 justify-center items-center">
            <div className="bg-[#191b1fcc] pl-7 h-[50%] w-[80%] top-4 flex flex-col items-start justify-start">
            <div className="h-6 w-18 mb-2 mt-6 top-[2px] text-[11px] font-bold px-2 py-1 text-black bg-white">
                Offline
            </div>
            <p className="text-white  font-semibold text-4xl sm:text-2xl">
                {username} is offline.
            </p>
            </div>
        </div>
    )
}