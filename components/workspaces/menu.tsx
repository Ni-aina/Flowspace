"use client";

import { Home, Inbox, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        icon: <Home size={18} />,
        label: "Home",
        link: "/dashboard"
    },
    {
        icon: <MessageCircle size={18} />,
        label: "Chat",
        link: "/dashboard/chat"
    },
    {
        icon: <Inbox size={18} />,
        label: "Inbox",
        link: "/dashboard/inbox"
    }
]

const Menu = () => {
    const [displayedLabel, setDisplayedLabel] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const pathname = usePathname();

    useEffect(()=> {
        if (!menuItems?.find(item => item.link === pathname)) return;
        setCurrentIndex(0);
        setDisplayedLabel("");
    }, [pathname])

    useEffect(() => {
        const currentLabel = menuItems.find(item => item.link === pathname)?.label || "";

        if (currentIndex >= currentLabel.length) return;

        const timeout = setTimeout(() => {
            setDisplayedLabel(prev => prev + currentLabel[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, 20);

        return () => clearTimeout(timeout);
    }, [currentIndex, pathname])

    return ( 
        <div className="flex items-center gap-3">
            {
                menuItems.map((item, index) => (
                    <Link 
                        key={index} 
                        className={`
                            ${item.link === pathname ? "bg-neutral-700/5" : "cursor-pointer"}
                            flex items-center gap-1
                            rounded-full
                            px-2 py-1
                        `}
                        href={item.link}
                    >
                        {item.icon}
                        <h1 
                            className={
                            `
                                ${pathname === item.link ? "block" : "hidden"}
                                text-sm font-medium
                            `
                        }>
                            {displayedLabel}
                        </h1>
                    </Link>
                ))
            }
        </div>
    )
}
 
export default Menu;