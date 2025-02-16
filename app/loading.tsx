import React from 'react'
import Logo from './(auth)/_components/logo';

const LoadingLayout = () => {
  return (
    <div className='h-screen w-full bg-black z-[10000] flex flex-col items-center justify-center'>
        <Logo />
    </div>
  )
}

export default LoadingLayout