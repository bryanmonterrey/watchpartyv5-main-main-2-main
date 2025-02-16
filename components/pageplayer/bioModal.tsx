// components/pageplayer/bioModal.tsx

"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
} from "@/components/ui/dialog";
import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"

interface BioModalProps {
    initialValue: string | null;
};

export const BioModal = ({
    initialValue,
}: BioModalProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(initialValue || "");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            updateUser({ bio: value})
            .then(() => { 
                toast.success("Bio updated successfully")
                closeRef.current?.click();  
            })
            .catch(() => toast.error("Something went wrong"))
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto text-white hover:no-underline">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit User Bio
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea 
                    placeholder="User Bio"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    disabled={isPending}
                    className="resize-none"
                    />
                    <div className="flex justify-center">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                        disabled={false}
                        type="submit"
                        variant="primary"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};