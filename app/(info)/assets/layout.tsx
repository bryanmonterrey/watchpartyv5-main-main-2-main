"use client";

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import NavBar from "./_components/navbar";
import Logo from '@/app/(browse)/_components/navbar/logo';

interface ResourceLayoutProps {
  children: React.ReactNode;
}

const CreatorLayout = ({children}: ResourceLayoutProps) => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 ">
        <main className="max-w-[80ch] mx-auto text-sm w-full pt-4 space-y-6">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default CreatorLayout;

function Footer() {
  const pathname = usePathname();

  const links = [
    { name: 'about', url: '/assets/about' },
    { name: 'advertisers', url: '/assets/advertisers' },
    { name: 'community guidelines', url: '/assets/community-guidelines' },
    { name: 'contact', url: '/assets/contact' },
    { name: 'feature requests', url: '/assets/feature-requests' },
    { name: 'giftcards', url: '/assets/giftcards' },
    { name: 'investors', url: '/assets/investors' },
    { name: 'merch', url: '/assets/merch' },
    { name: 'newsletter', url: '/assets/newsletter' },
    { name: 'support', url: '/assets/support' },
    { name: 'terms & conditions', url: '/assets/terms' },
  ];

  return (
    <footer className="mt-12">
      <div className="flex flex-wrap justify-center gap-4 tracking-tight text-wrap">
        {links.map((link) => (
          pathname !== link.url && (
            <Link
              key={link.name}
              href={link.url}
              className="text-gray-400 hover:text-azul transition-colors duration-200"
            >
              {link.name}
            </Link>
          )
        ))}
      </div>
    </footer>
  );
}