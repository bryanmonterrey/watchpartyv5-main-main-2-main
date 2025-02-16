"use client";

import { useTransition, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/auth-service.client";
import { createIngress } from "@/actions/ingress";
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ConnectModalProps {
  onConnectionGenerated: (serverUrl: string, streamKey: string) => void;
}

export const ConnectModal = ({ onConnectionGenerated }: ConnectModalProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const onSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to generate a connection");
      return;
    }

    startTransition(() => {
      createIngress()
        .then((result) => {
          const data = JSON.parse(result);
          console.log("Ingress created:", data);
          onConnectionGenerated(data.serverUrl, data.streamKey);
          toast.success("Connection generated successfully");
          closeRef.current?.click();
        })
        .catch((error) => {
          console.error("Error creating ingress:", error);
          toast.error("Failed to generate connection. Please try again.");
        });
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-2.5 h-9 rounded-lg" variant="primary">
          Generate Connection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex text-emerald-400 justify-center">
            Generate Connection
          </DialogTitle>
        </DialogHeader>
        <Alert className="flex flex-col items-center">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all current streams using the current connection
          </AlertDescription>
        </Alert>
        <div className="w-full flex justify-center gap-x-2">
          <Button 
            disabled={isPending}
            variant="primary" 
            onClick={onSubmit}
            className="flex justify-between"
          >
            Generate 
          </Button>
          <DialogClose ref={closeRef} asChild>
            <Button variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};