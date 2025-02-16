import Image from "next/image";
import React from 'react'
import { Link } from 'next-view-transitions'

const Logo = () => {
  return (
    <Link href="/">
        <div className="flex flex-col cursor-pointer z-[50] text-base text-white font-medium pl-1.5 items-center opacity-90 active:scale-95 justify-center pr-1 pt-2 gap-y-20 pb-2 hover:opacity-100 transition">
            watchparty
        </div>
    </Link>
  )
}

export default Logo