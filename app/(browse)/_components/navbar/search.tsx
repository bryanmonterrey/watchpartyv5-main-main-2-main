"use client"

import qs from "query-string";
import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {Kbd} from "@nextui-org/react";

import { Input } from "@/components/ui/input";

import React from 'react'

const Search = () => {
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
        <SearchIcon className="h-4 w-4 min-h-4 min-w-4 text-white/80 transition-colors ease-in-out duration-700 active:text-white" strokeWidth={3}/>
        <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="rounded-r-none bg-transparent h-[36px] font-regular placeholder:font-regular text-white placeholder:text-white/80 border-none text-[16px] focus-visible:ring-0 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        {!value && (
            <Kbd className="relative text-white/80 bg-black transition-colors border-buttongray border-1 ease-in-out duration-700 hover:text-white" keys={["command"]}>k</Kbd>
        )}
        {value && (
            <X className="relative ml-3 h-[16px] w-[16px] text-white/80 cursor-pointer hover:text-white transition-colors ease-in-out duration-700"
            onClick={onClear} strokeWidth={3}/>
        )}
        
     </form>
  );
};

export default Search