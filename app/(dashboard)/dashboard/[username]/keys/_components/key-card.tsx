"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { CopyButton } from "./copybutton";
import { Button } from "@/components/ui/button";
import Image from "next/image";


interface KeyCardProps {
    value: string | null;
};

export const KeyCard = ({
    value,
}: KeyCardProps) => {
    const [show, setShow] = useState(false);
    return (
        <div className="rounded-xl bg-[#1c1b1e] p-6">
            <div className="flex items-center gap-x-10">
                <p className="font-semibold shrink-0">
                    Stream Key
                </p>
                <div className="space-y-2 w-full">
                    <div className="w-full flex items-center gap-x-2">
                        <Input 
                        value={value || ""}
                        type={show ? "text" : "password"}
                        disabled
                        placeholder="Stream key"
                        />
                        <Button
                        onClick={() => setShow(!show)}
                        size="sm"
                        variant="ghost"
                        >
                        <Image className="relative" width={24} height={24} src={show ? "/eye.svg" : "/closed.svg"}
                                alt={show ? "hide" : "show"}/>
                    </Button>
                        <CopyButton 
                        value={value || ""}
                        />
                    </div>
                    
                </div>
            </div>

        </div>
    );
};