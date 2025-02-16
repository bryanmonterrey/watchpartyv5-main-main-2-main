"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a more sophisticated loading state
  }

  if (!user) {
    return null; // Or handle the case when there's no user
  }

  const navItems = [
    { label: "Stream", href: `/dashboard/${user?.username}` },
    { label: "Profile", href: `/dashboard/${user?.username}/profile` },
    { label: "Messages", href: `/dashboard/${user?.username}/messages` },
    { label: "Vods", href: `/dashboard/${user?.username}/vods` },
    { label: "Community", href: `/dashboard/${user?.username}/community` },
    { label: "Subscriptions", href: `/dashboard/${user?.username}/subscriptions` },
    { label: "Settings", href: `/dashboard/${user?.username}/settings` },
  ];

  return (
    <div className='gap-x-7 inline-flex items-center justify-center'>
      {navItems.map((item) => (
        <Button 
          key={item.href}
          className={cn(
            'bg-transparent hover:bg-transparent',
            pathname === item.href ? 'text-white' : 'text-white/80 hover:text-white'
          )}
        >
          <Link 
            href={item.href} 
            className={cn(
              'h-full flex items-center justify-center',
              'hover:transition-all hover:ease-in-out hover:duration-300',
              'font-medium text-[15px]',
              'active:text-white hover:text-white active:scale-95 active:duration-100 active:transition-none',
              pathname === item.href && 'text-white'
            )}
          >
            <p>{item.label}</p>
          </Link>
        </Button>
      ))}
    </div>
  );
};