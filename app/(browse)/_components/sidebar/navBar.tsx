"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/store/use-sidebar";
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Hint from "@/components/hint";

const NavBar = () => {
    const { collapsed } = useSidebar((state) => state);
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'home', icon: '/home.svg' },
        { href: '/browse', label: 'browse', icon: '/search.svg' },
        { href: '/following', label: 'following', icon: '/following.svg' },
    ];

    return (
        <div className="w-full">
            {!collapsed && (
                <div className="inline-block pl-3 mt-1 space-y-2 w-full items-start">
                    {links.map((link, index) => (
                        <div key={link.href} className="w-full hover:cursor-pointer pr-10">
                            <Link href={link.href}>    
                                <motion.div
                                    initial={{ opacity: 0, x: 0 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 0 }}
                                    transition={{ duration: .1, ease: "easeInOut" }}
                                    className={`inline-flex justify-start w-full items-center space-x-3 ${pathname === link.href ? '' : ''}`}> 
                                    <motion.div
                                     initial={{ opacity: 0, x: 0 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     exit={{ opacity: 0, x: 0 }}
                                     transition={{ duration: .05, ease: "easeInOut" }}
                                    >                             
                                        <Image src={link.icon} alt={link.label} width={18} height={18} className=""/>
                                    </motion.div>
                                    
                                    <div>
                                        <p className={`text-base font-medium ${pathname === link.href ? 'text-litewhite' : 'text-litepurp'}`}>
                                            {link.label}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {collapsed && (
                <div className="flex items-center">
                    <div className="inline-block space-y-4 mt-1 mx-auto">
                        {links.map((link) => (
                            <Hint label={link.label} placement="right">
                                <motion.div
                                    initial={{ opacity: 1, x: 0 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 0 }}
                                    transition={{ duration: 0.1, ease: "easeInOut" }} 
                                    key={link.href} 
                                    className={`${pathname === link.href ? 'rounded-lg' : ''}`}
                                >
                                    <Link href={link.href}>
                                        <Image src={link.icon} alt={link.label} width={18} height={18} className=""/>
                                    </Link>
                                </motion.div>
                            </Hint>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NavBar