import React from 'react'
import Logo from '@/app/(browse)/_components/navbar/logo';
import Actions from './actions';


const NavBar = () => {
  return (
    <nav className='fixed top-0 w-full h-[44px] backdrop-blur-custom backdrop-blur-lg bg-transparent z-[1000] lg:pr-2 lg:pl-1 flex justify-between items-center'>
      <div className='h-7 w-[188px]'></div>
      <div className='inline-flex'>
        <div className='mx-auto mt-3'>
          <Logo/>
        </div>
      </div>  
      <Actions />       
    </nav>
  );
};

export default NavBar