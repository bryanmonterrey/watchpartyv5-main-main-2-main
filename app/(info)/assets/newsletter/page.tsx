import React from 'react';
import { Inter } from 'next/font/google';
import Logo from '@/app/(browse)/_components/navbar/logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Newsletter',
  };

const About = () => {
    return (
        <div className={inter.className}>
        <div className='flex flex-col max-w-[80ch] font-normal leading-snug justify-between space-y-4 mx-auto antialiased tracking-tight '>
            <div className='mx-auto'>
            </div>
            <h1 className='text-3xl font-bold mx-auto bg-custom-gradient bg-clip-text text-transparent !important'>Newsletter</h1>
            <div className='space-y-6 w-full'>
            <p>As I write this I&apos;m focused on making the best possible product I can&nbsp;make. 
                It&apos;s impossible to control the outcome and I&apos;m not focused on it.</p>

<p>I&apos;ve been a huge consumer my whole life and I know what makes me happy. Products are not always available and they can sell out fast if you can&apos;t get your hands on them quick enough. It&apos;s because of this reason I started coding and writing automation… to get my hands on products I love. </p>

<p>I&apos;m now on the other end of this where I&apos;ve started to create products that the public will hopefully love one day. Watchparty is my first attempt in making consumer products and I hope it&apos;s received well by you and everyone. </p>

<p>Watchparty is my implementation of today&apos;s streaming app with a design-heavy focus and an enhanced user experience for the streaming scene of today and tomorrows, heavily influenced by many of the major apps we all use today.</p>

<p>While I focus on user experience, I&apos;ve also considered how to keep an awesome, open community. Freedom of speech and expression are at stake when censorship starts to kick in. I don&apos;t ever want my access to moderation to become a powergrab... it dims the fun and begins to change the status quo and overall feelings of the user. My job here is to meet any type of criticism and issue with positive actions as I continue to improve the site everyday.</p>
    
    <p>Aside from site performance and design I don&apos;t want my presence to be felt at all unless it&apos;s by popular demand. keyword: popular</p>
</div>
        </div>
        </div>
    )
}

export default About;