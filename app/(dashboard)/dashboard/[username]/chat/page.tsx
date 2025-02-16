import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import { ToggleCard } from "./_components/toggle-card";


const ChatPage = async () => {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);

    if (!stream) {
        throw new Error("Stream not found");
    }


    return (
        <div className="p-2">
            <div className="mb-2">
                <h1 className="text-base font-semibold">
                    Chat settings
                </h1>
            </div>
            <div className="space-y-1 ">
                <ToggleCard 
                field="isChatEnabled"
                label="Enable Chat"
                value={stream.isChatEnabled}

                />
                <ToggleCard 
                field="isChatDelayed"
                label="Delay Chat"
                value={stream.isChatDelayed}

                />
                <ToggleCard 
                field="isChatFollowersOnly"
                label="Followers Only"
                value={stream.isChatFollowersOnly}

                />
            </div>
        </div>
    );
}

export default ChatPage;