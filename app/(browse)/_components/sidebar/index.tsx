import React from 'react';
import { Wrapper } from './wrapper';
import Toggle from './toggle';
import { Following, FollowingSkeleton } from './following';
import Recommended, { RecommendedSkeleton } from './recommended';
import ToggleSkeleton from './toggle';

import { getRecommended } from '@/lib/recommended-service';
import { getFollowedUsers } from '@/lib/follow-service';
import NavBar from './navBar';
import { Divider } from '@nextui-org/react';

const Sidebar = async () => {
    const recommended = await getRecommended();
    const following = await getFollowedUsers();

  return (
    <Wrapper>
        <div className='flex justify-end'>
             <Toggle />
        </div>
        <div className='flex items-center mb-4 justify-center'>
            <NavBar />
        </div>
        <Divider className='w-5 h-0.5 rounded-full mx-auto bg-white/30' />
        <div className='space-y-3 pt-2 mt-2'>
            <Following data={following} />
            <Recommended data={recommended} />
        </div>
    </Wrapper>
  )
}

export default Sidebar

export const SidebarSkeleton = () => {
    return (
        <aside className='fixed left-0 flex flex-col w-[44px] lg:w-[44px] h-full z-50'>
            <ToggleSkeleton />
            <FollowingSkeleton />
            <RecommendedSkeleton />
        </aside>
    );
};
