import React from 'react'
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions'
import { ArrowUpRight, Menu } from 'lucide-react';

const actions = () => {
  return (
    <div className='flex items-center justify-end gap-x-2 lg:ml-0'>
        <Button
        size="sm"
        variant="ghost"
        className='text-litepurp/90 text-[15px] bg-buttongray px-3 font-medium mr-3 hover:text-white'
        asChild >
            <Link href="/">
            <ArrowUpRight className='h-5 w-5 mr-2' strokeWidth={2.75}/>
                Back to watchparty
            </Link>
        </Button>
    </div>
  )
}

export default actions