// app/(browse)/_components/navbar/index.tsx
"use client";

import React from 'react'
import Logo from '@/app/(browse)/_components/navbar/logo';
import Search from '@/app/(browse)/_components/navbar/search';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import PopoverWithHint from '@/components/popoverWithHint';
import { ClientActions } from '@/app/(browse)/_components/navbar/clientActions';

interface NavBarProps {
  user: any;
  subscriptionStatus: any;
}

const NavBar: React.FC<NavBarProps> = ({ user, subscriptionStatus }) => {
  // Example of popover with items
  const popoverItems = [
    { key: "new", label: "New file" },
    { key: "copy", label: "Copy link" },
    { key: "edit", label: "Edit file" },
    { key: "delete", label: "Delete file", color: "danger" }
  ];

  const handlePopoverItemSelect = (key: string) => {
    console.log(`Selected item: ${key}`);
    // Handle item selection here
  };

  return (
    <nav className='fixed top-0 w-full h-[44px] backdrop-blur-custom backdrop-blur-lg z-[1000] bg-appleblack/90 lg:pr-2 lg:pl-1 flex justify-center items-center'>
      <Logo />
      <div className='gap-x-7 ml-7 inline-flex items-center justify-center'>
        {/* ... other nav items ... */}
        
        {/* Popover with items */}
        <PopoverWithHint
          triggerContent={
            <Button
              variant="ghost"
              size="sm"
              className='text-litepurp/90 hover:text-lightpurp flex items-center justify-center hover:transition-all hover:ease-in-out hover:duration-300 h-7 w-7 active:scale-95'
            >
              <Hash className='text-inherit h-[16px] w-[16px] min-h-[16px] min-w-[16px] m-auto' strokeWidth={3}/>
            </Button>
          }
          items={popoverItems}
          openLabel="Menu"
          closeLabel="Close Menu"
          openHintPlacement="bottom-start"
          closeHintPlacement="top-end"
          placement="bottom"
          showArrow={true}
          onItemSelect={handlePopoverItemSelect}
        />

        {/* Example of popover with custom content */}
        <PopoverWithHint
          triggerContent={
            <Button variant="ghost" size="sm">
              Custom Content
            </Button>
          }
          popoverContent={
            <div className="p-4">
              <h3 className="text-lg font-bold">Custom Popover Content</h3>
              <p>This is an example of custom content in the popover.</p>
            </div>
          }
          openLabel="Open Custom"
          closeLabel="Close Custom"
          openHintPlacement="bottom-start"
          closeHintPlacement="top-end"
          placement="bottom"
          showArrow={true}
        />
      </div>
      <PopoverWithHint
          triggerContent={
            <Button
              variant="ghost"
              size="sm"
              className='text-litepurp/90 hover:text-lightpurp flex items-center justify-center hover:transition-all hover:ease-in-out hover:duration-300 h-7 w-7 active:scale-95'
            >
              <Hash className='text-inherit h-[16px] w-[16px] min-h-[16px] min-w-[16px] m-auto' strokeWidth={3}/>
            </Button>
          }
          popoverContent={
            <div className="px-1 py-2">
              <div className="text-sm font-bold">Popover Content</div>
              <div className="text-xs">This is the popover content</div>
            </div>
          }
          openLabel="Menu"
          closeLabel="Close Menu"
          openHintPlacement="bottom-start"
          closeHintPlacement="top-end"
          placement="bottom"
          showArrow={true}
        />
      {/* ... rest of the navbar ... */}
      <ClientActions />
    </nav>
  );
};

export default NavBar;