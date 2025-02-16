import React from 'react'
import Logo from './_components/logo';

const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
        <Logo />
        {children}
        </div>
  )
}

export default AuthLayout