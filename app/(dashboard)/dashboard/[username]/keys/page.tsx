import { getSelf } from "@/lib/auth-service.server";
import { getStreamByUserId } from "@/lib/stream-service";
import KeysClient from "./_components/keys-client";

export default async function KeysPage() {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    throw new Error("Stream not found");
  }

  return <KeysClient initialServerUrl={stream.serverUrl || ""} initialStreamKey={stream.streamKey || ""} />;
}