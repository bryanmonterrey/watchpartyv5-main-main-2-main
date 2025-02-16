import React from 'react';
import { SignInButton, UserButton, SignUpButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import { Clapperboard, Mail, Mountain, Bell } from 'lucide-react';
import { PremiumButton } from './_components/premiumButton';
import { useSubscriptionStatus } from '@/lib/client-subscription-status';
import Image from 'next/image';
import { Hint } from '@/components/hint';
import PopoverWithHint from '@/components/popoverWithHint';

export const ClientActions: React.FC = () => {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { status: subscriptionStatus, error: subscriptionError, isLoading: isSubscriptionLoading } = useSubscriptionStatus();

  console.log('ClientActions: isUserLoaded:', isUserLoaded);
  console.log('ClientActions: isSignedIn:', isSignedIn);
  console.log('ClientActions: subscriptionStatus:', subscriptionStatus);
  console.log('ClientActions: subscriptionError:', subscriptionError);
  console.log('ClientActions: isSubscriptionLoading:', isSubscriptionLoading);

  if (!isUserLoaded) {
    return <div className='inline-flex gap-x-4 items-center justify-center'><div className='bg-buttongray animate-pulse w-32 h-2 rounded-md'/> <div className='bg-buttongray animate-pulse h-7 w-7 rounded-md'></div></div>;
  }

  return (
    <div className='flex items-center justify-end gap-x-2 ml-4 lg:ml-0'>
      {!isSignedIn && (
        <>
          <SignInButton>
            <Button size="sm" className="px-3.5 h-7 text-litewhite rounded-md bg-azul hover:bg-[#0054A9]" variant="primary">
              Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="default" className="bg-[#333337] rounded-md px-3.5 h-7 text-litewhite hover:bg-hovergray" variant="ghost">
              Sign up
            </Button>
          </SignUpButton>
        </>
      )}
      
      {isSignedIn && user && (
        <>
          <div className='inline-flex gap-x-1 items-center justify-center'>
            <div>
              <Hint label='Notifications' placement='bottom-end' asChild>
                <Button 
                  size="sm"
                  variant="ghost"
                  className=' h-7 w-7 active:scale-95 text-white/80 hover:text-white hover:transition-all hover:ease-in-out hover:duration-300'
                >
                  <Bell className='text-inherit h-[16px] w-[16px]' strokeWidth={3}/>
                </Button>
              </Hint>
            </div>
            <div>
            <PopoverWithHint 
            triggerContent={
                <Button 
                  size="sm"
                  variant="ghost"
                  className='h-7 w-7 active:scale-95 text-white/80 hover:text-white hover:transition-all hover:ease-in-out hover:duration-300'
                >
                  <Mail className='text-inherit h-4 w-4 mx-auto px-auto' strokeWidth={3}/>
                </Button>
            }
            popoverContent={
                <div className="px-1 py-2 w-[265px]">
                  <div className="text-sm font-bold">Notification Content</div>
                  <div className="text-xs">This is the notification content</div>
                </div>
              } 
                openLabel="Messages"
                openHintPlacement="bottom-end"
                placement="bottom-end"
                showArrow={true}
                />
            </div>
            {isSubscriptionLoading ? (
               <PremiumButton />
            ) : subscriptionError ? (
              <p>Error: {subscriptionError}</p>
            ) : subscriptionStatus?.isSubscribed ? (
              <div>
                <Hint label='Premium' placement='bottom-end' asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className=' h-7 w-7  active:scale-95 '
                  >
                    <Image src="/bolt.svg" width={14} height={14} alt="Premium"/>
                  </Button>
                </Hint>
              </div>
            ) : (
              <PremiumButton />
            )}
            <div className='flex hover:text-[#00ED89] items-center gap-x-4 mr-2'>
              <Hint label='Dashboard' placement='bottom-end' asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className='h-7 w-7 active:scale-95 text-white/80 hover:text-white hover:transition-all hover:ease-in-out hover:duration-300'
                  asChild
                >
                  <Link href={`/dashboard/${user.username}`} >
                    <Clapperboard className='text-inherit h-[17px] w-[18px]' strokeWidth={3} />
                  </Link>
                </Button>
              </Hint>
              <UserButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
};