import Image from "next/image";

export const VerifiedCheck = () => {
    return (
        <div className="p-0.5 flex items-center justify-center">
            <Image src="/checky.svg" width={18} height={18} className="h-5 w-5" alt="Verified Check"/>
        </div>
    );
};