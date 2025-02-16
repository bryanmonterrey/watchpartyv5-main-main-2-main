"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { 
    Fullscreen,
    KeyRound,
    MessageSquare,
    Users,
} from "lucide-react"
import { NavItem, NavItemSkeleton } from "./navItem";
import Image from "next/image";

export const Navigation = () => {
    const pathname = usePathname();
    const { user } = useUser();

    const routes = [
        {
            label: "Stream",
            href: `/dashboard/${user?.username}`,
            icon: <Image src="/cam.svg" alt="cam" width={20} height={20}/>,
        },
        {
            label: "Personalization",
            href: `/dashboard/${user?.username}/personalization`,
            icon: <Image src="/personalization.svg" alt="personalization" width={20} height={20}/>,
        },
        {
            label: "Keys",
            href: `/dashboard/${user?.username}/keys`,
            icon: <Image src="/keys.svg" alt="keys" width={20} height={20}/>,
        },
        {
            label: "Chat",
            href: `/dashboard/${user?.username}/chat`,
            icon: MessageSquare,
        },
        {
            label: "Community",
            href: `/dashboard/${user?.username}/community`,
            icon: <Image src="/globe.svg" alt="globe" width={20} height={20}/>,
        },
        {
            label: "Monetization",
            href: `/dashboard/${user?.username}/monetization`,
            icon: <Image src="/money.svg" alt="money" className="ml-0.5 mr-1" width={15} height={15}/>,
        },
        {
            label: "Subscriptions",
            href: `/dashboard/${user?.username}/subscriptions`,
            icon: <Image src="/bolt3.svg" alt="bolt3" width={18} height={18} className="mr-0.5"/>,
        },
    ];

    if(!user?.username) {
        return (
            <ul className="space-y-0">
                {[...Array(4)].map((_, i) => (
                    <NavItemSkeleton key={i} />
                ))}
            </ul>
        );
    }

    return (
        <ul className="space-y-0 font-bold px-2 pt-4 lg:pt-0">
           {routes.map((route) => (
                <NavItem
                key={route.href} label={route.label} icon={route.icon} href={route.href} isActive={pathname === route.href}
                />
           ))}
        </ul>
    );
};