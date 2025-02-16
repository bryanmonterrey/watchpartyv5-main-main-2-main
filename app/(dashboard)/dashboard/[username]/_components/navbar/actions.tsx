import React from 'react'
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import { Home } from 'lucide-react';

const actions = () => {
  return (
    <div className='flex items-center justify-end gap-x-2 ml-4 lg:ml-0'>
        <Button
        size="sm"
        variant="ghost"
        className='text-litepurp/90 text-[15px] bg-buttongray px-3 font-medium mr-3 hover:text-white'
        asChild >
            <Link href="/">
            <Home className='h-4 w-4 mr-2' strokeWidth={2.75}/>
                Exit Dashboard
            </Link>
        </Button>
        <UserButton        
        />
    </div>
  )
}

export default actions