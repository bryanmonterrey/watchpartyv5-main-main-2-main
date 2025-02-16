"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './logo';
import Search from './search';
import { Link } from 'next-view-transitions';
import { SignedIn, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import PopoverWithHint from '@/components/popoverWithHint';
import { ClientActions } from './clientActions';
import { useSubscriptionStatus } from '@/lib/client-subscription-status';
import { cn } from "@/lib/utils";
import Blank from './_components/blank';

interface PopoverItem {
  key: string;
  label: string;
  url: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | string;
}

interface NavItemsProps {
  isUserLoaded: boolean;
  popoverItems: PopoverItem[];
  handlePopoverItemSelect: (key: string) => void;
}

const NavItems: React.FC<NavItemsProps> = ({ isUserLoaded, popoverItems, handlePopoverItemSelect }) => {
  const pathname = usePathname();

  if (!isUserLoaded) {
    return <div className='bg-buttongray animate-pulse w-36 h-2 rounded-full'></div>;
  }

  return (
    <>
      <Button className={cn(
        'bg-transparent hover:bg-transparent',
        pathname === '/browse' ? 'text-white' : 'text-white/80 hover:text-white '
      )}>
        <Link href="/browse" className='h-full flex items-center justify-center hover:transition-colors hover:ease-in-out hover:duration-300 font-medium text-[16px] active:text-white hover:text-white active:duration-100'>
          <p>Browse</p>
        </Link>
      </Button>
      <SignedIn>
        <Button className={cn(
          'bg-transparent hover:bg-transparent m-auto flex items-center justify-center',
          pathname === '/following' ? 'text-white' : 'text-white/80 hover:text-white '
        )}>
          <Link href="/following" className='h-full flex items-center justify-center hover:transition-colors hover:ease-in-out hover:duration-300 font-medium text-[16px] active:text-white hover:text-white active:duration-100'>
            <p>Following</p>
          </Link>
        </Button>
      </SignedIn>     
      <PopoverWithHint
        triggerContent={
          <Button
            variant="ghost"
            size="sm"
            className='text-white/80 hover:text-white active:text-white flex items-center justify-center hover:transition-all hover:ease-in-out hover:duration-300 h-6 w-6 active:scale-95 focus-visible:text-white'
          >
            <Hash className='text-inherit h-[16px] w-[16px] min-h-[16px] min-w-[16px] m-auto' strokeWidth={3}/>
          </Button>
        }
        popoverContent={
          <div className="p-4">
            <p>Menu</p>
          </div>
        }
        items={popoverItems}
        openLabel="Menu"
        openHintPlacement="bottom-start"
        placement="bottom"
        showArrow={true}
        onItemSelect={handlePopoverItemSelect}
      />
    </>
  );
};

const NavBar: React.FC = () => {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const subscriptionStatus = useSubscriptionStatus();
  const router = useRouter();
  const pathname = usePathname();

  const popoverItems: PopoverItem[] = [
    { key: "about", label: "About", url: "/assets/about" },
    { key: "advertisers", label: "Advertisers", url: "/assets/advertisers" },
    { key: "guidelines", label: "Community Guidelines", url: "/assets/community-guidelines" },
    { key: "contact", label: "Contact", url: "/assets/contact" },
    { key: "feature-requests", label: "Feature Requests", url: "/assets/feature-requests" },
    { key: "gift-cards", label: "Gift Cards", url: "/assets/gift-cards" },
    { key: "investors", label: "Investors", url: "/assets/investors" },
    { key: "merch", label: "Merch", url: "/assets/merch" },
    { key: "newsletter", label: "Newsletter", url: "/assets/newsletter" },
    { key: "support", label: "Support", url: "/assets/support" },
    { key: "terms", label: "Terms and Conditions", url: "/assets/terms" },
  ];

  const handlePopoverItemSelect = (key: string) => {
    const selectedItem = popoverItems.find(item => item.key === key);
    if (selectedItem) {
      console.log(`Selected item: ${key}, redirecting to: ${selectedItem.url}`);
      router.push(selectedItem.url);
    }
  };

  return (
    <nav className='fixed top-0 w-full h-[44px] z-[1000] bg-transparent backdrop-blur-custom backdrop-filter backdrop-blur-xl bg-opacity-80 lg:pr-2 lg:pl-1 flex justify-center items-center'>
      <Logo />
      <div className='gap-x-7 ml-7 inline-flex items-center justify-center'>
        <NavItems isUserLoaded={isUserLoaded} popoverItems={popoverItems} handlePopoverItemSelect={handlePopoverItemSelect} />
      </div>
      <div className='relative z-[50] mr-auto ml-auto flex-grow flex items-center justify-center'>
      <div className='transition-all ease-in-out duration-200 m-auto pl-2 pr-3 border-1 border-buttongray/30 bg-black rounded-full'>
        <Blank />
      </div>
      </div>
      <ClientActions />
    </nav>
  );
};

export default NavBar;