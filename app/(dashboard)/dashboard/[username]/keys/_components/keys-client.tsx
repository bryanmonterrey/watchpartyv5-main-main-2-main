"use client";

import { useState } from "react";
import { useCurrentUser } from "@/lib/auth-service.client";
import { UrlCard } from "./url-card";
import { KeyCard } from "./key-card";
import { ConnectModal } from "./connect-modal";

interface KeysClientProps {
  initialServerUrl: string;
  initialStreamKey: string;
}

const KeysClient = ({ initialServerUrl, initialStreamKey }: KeysClientProps) => {
  const user = useCurrentUser();
  const [serverUrl, setServerUrl] = useState(initialServerUrl);
  const [streamKey, setStreamKey] = useState(initialStreamKey);

  const handleConnectionGenerated = (newServerUrl: string, newStreamKey: string) => {
    setServerUrl(newServerUrl);
    setStreamKey(newStreamKey);
  };

  return (
    <div className="p-6 w-full h-screen  mr-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Keys & URLs
        </h1>
        <ConnectModal onConnectionGenerated={handleConnectionGenerated} />
      </div>
      <div className="space-y-4">
        {serverUrl && <UrlCard value={serverUrl} />}
        {streamKey && <KeyCard value={streamKey} />}
      </div>
    </div>
  );
}

export default KeysClient;