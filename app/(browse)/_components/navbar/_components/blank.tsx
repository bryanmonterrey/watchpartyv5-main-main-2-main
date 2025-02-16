"use client"

import qs from "query-string";
import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {Kbd} from "@nextui-org/react";

import { Input } from "@/components/ui/input";

import React from 'react'

const Blank = () => {
    const router= useRouter();
    const [value, setValue] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!value) return;

        const url = qs.stringifyUrl({
            url: "/search",
            query: { term: value },
        }, { skipEmptyString: true});

        router.push(url);
    }

    const onClear = () => {
        setValue("");
        
    }

  return (
    <form
    onSubmit={onSubmit}
    className="w-full relative transition-colors ease-in-out duration-1000 lg:w-[275px] justify-center flex items-center"> 
        <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="search?"
        className="rounded-r-none bg-transparent h-[36px] font-regular border-none text-[16px] focus-visible:ring-0 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover-placeholder"
        />    
     </form>
  );
};

export default Blank