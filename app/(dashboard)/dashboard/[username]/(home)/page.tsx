import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";
import { StreamPlayer } from "@/components/stream-player";

export const metadata = {
    title: 'Dashboard',
  };

interface CreatorPageProps {
    params: {
        username: string;
    };
};

const CreatorPage = async ({
    params,
}: CreatorPageProps) => { 
    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
        throw new Error("Unauthorized");
    }

    return (
        <div className="bg-black h-[calc(100vh-44px)]">           
            <StreamPlayer 
            user={user}
            stream={user.stream}
            isFollowing
            />
        </div>
    );
};

export default CreatorPage;