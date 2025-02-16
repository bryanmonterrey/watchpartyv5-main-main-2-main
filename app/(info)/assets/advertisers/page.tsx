import React from 'react';
import { Inter } from 'next/font/google';
import Logo from '@/app/(browse)/_components/navbar/logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Advertisers',
  };

const About = () => {
    return (
        <div className={inter.className}>
        <div className='flex flex-col max-w-[80ch] font-normal leading-snug justify-between space-y-4 mx-auto antialiased tracking-tight '>
            <div className='mx-auto'>
            </div>
            <h1 className='text-3xl font-bold mx-auto bg-custom-gradient bg-clip-text text-transparent !important'>Advertisers</h1>
            <div className='space-y-6 w-full'>
            <p>Advertisers open doors for everyone. If you can support your favorite streamer even more by giving them another revenue stream, why not? Applications are also open if you want to advertise on our site.</p>

</div>
        </div>
        </div>
    )
}

export default About;