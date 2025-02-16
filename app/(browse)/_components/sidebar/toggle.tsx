"use client";


import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { useSidebar } from '@/store/use-sidebar';
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Toggle = () => {
    const {
        collapsed,
        onExpand,
        onCollapse,

    } = useSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
    { collapsed && (
        <div 
        className='hidden lg:flex w-full items-center justify-center pt-0.5 mb-1 cursor-pointer'>
            <Hint label={label} placement="right" asChild>
                <Button 
                onClick={onExpand}
                variant="ghost" 
                className="h-6 w-6 rounded-lg cursor-pointer">
                    <ChevronRight className='h-4 w-4 text-azul' strokeWidth={3}/>
                </Button>
            </Hint>
        </div>
    )}
     {!collapsed && (
        <div className='cursor-pointer pb-2 pr-1.5 pt-0.5 pl-5 mb-2 flex items-center z-51 absolute'>     
            <Hint label={label} placement='right' asChild>
                <Button 
                onClick={onCollapse}
                className='cursor-pointer rounded-lg w-6 h-6 ml-auto' 
                variant="ghost">
                    <ChevronLeft className='h-4 w-4 text-azul' strokeWidth={3}/>
                </Button>
            </Hint>
        </div>
     )}
    </> 
  )
}

export default Toggle

export const ToggleSkeleton = () => {
    return (
        <div className='pb-1 pt-2 hidden lg:flex items-center justify-between w-full'>
            <Skeleton className='h-6 w-6 rounded-lg mx-auto bg-buttongray/70'/>
        </div>
    )
}