// components/pageplayer/infoModal.tsx

"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStream } from "@/actions/stream";
import { toast } from "sonner";
import { Hint } from "@/components/hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
    initialName: string;
    initialThumbnailUrl: string | null;
};

export const InfoModal = ({
    initialName,
    initialThumbnailUrl,
}: InfoModalProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState(initialName);
    const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);

    const onRemove = () => {
        startTransition(() => {
            updateStream({ thumbnailUrl: null })
               .then(() => {
                toast.success("Thumbnail removed");
                setThumbnailUrl("")
                
        })
               .catch(() => toast.error("Something went wrong"));
        });
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        startTransition(() => {
            updateStream({ name: name})
               .then(() => {
                toast.success("Stream updated successfully")
                closeRef?.current?.click();
        })
               .catch(() => toast.error("Something went wrong"));
        });
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex text-emerald-400 justify-center">
                        Edit Stream Info
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-14">
                    <div className="space-y-2">
                        <Label>
                            Name
                        </Label>
                        <Input 
                        disabled={isPending}
                        placeholder="Stream Name"
                        onChange={onChange}
                        value={name}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Thumbnail
                        </Label>
                        {thumbnailUrl ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <div className="absolute top-2 right-2 z-[10]">
                                    <Hint label="Remove thumbnail" asChild side="left">
                                        <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={onRemove}
                                        className="h-auto w-auto p-1.5"
                                        >
                                            <Trash className="h-4 w-4"/>
                                        </Button>
                                    </Hint>
                                </div>
                                <Image 
                                alt="thumbnail"
                                src={thumbnailUrl}
                                fill
                                className="object-cover"
                                />
                            </div>
                        ): (
                        <div className="rounded-xl outline-dashed outline-muted">
                            <UploadDropzone 
                            endpoint="thumbnailUploader"
                            appearance={{
                                label: {
                                    color: "#FFFFFF",
                                },
                                allowedContent: {
                                    color: "#FFFFFF",
                                }
                            }}
                            onClientUploadComplete={(res) => {
                                setThumbnailUrl(res?.[0].url);
                                router.refresh();
                            }}
                            />
                        </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={isPending} variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};