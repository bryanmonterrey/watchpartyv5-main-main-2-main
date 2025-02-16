import Image from "next/image";
import React from 'react'
import { Link } from 'next-view-transitions'

const Logo = () => {
  return (
    <Link href="/">
    <div className="flex text-[#fff] flex-col cursor-pointer items-center justify-center pl-2 pt-2 gap-y-20 pb-2 opacity-90 hover:opacity-100 transition">
        <Image src="/experimental.svg" alt="Logo" width={20} height={22} />
        </div>
        </Link>
  )
}

export default Logo