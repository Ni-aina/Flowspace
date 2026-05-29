"use client";

import { Home, Inbox, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isUUID } from "@/utils/isUUID";
import BoardItems from "../boards/items";

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
    const pathnameFormatted = isUUID(pathname.split("/").at(-1)!) ? "/dashboard" : pathname;

    useEffect(() => {
        if (!menuItems?.find(item => item.link === pathnameFormatted)) return;
        setCurrentIndex(0);
        setDisplayedLabel("");
    }, [pathnameFormatted])

    useEffect(() => {
        const currentLabel = menuItems.find(item => item.link === pathnameFormatted)?.label || "";

        if (currentIndex >= currentLabel.length) return;

        const timeout = setTimeout(() => {
            setDisplayedLabel(prev => prev + currentLabel[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, 20);

        return () => clearTimeout(timeout);
    }, [currentIndex, pathnameFormatted])

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                {
                    menuItems.map((item, index) => (
                        <Link
                            key={index}
                            className={`
                                ${item.link === pathnameFormatted ? "bg-neutral-700/5" : "cursor-pointer"}
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
                                    ${pathnameFormatted === item.link ? "block" : "hidden"}
                                    text-sm font-medium
                                `
                                }>
                                {displayedLabel}
                            </h1>
                        </Link>
                    ))
                }
            </div>
            {
                pathnameFormatted === "/dashboard" && <BoardItems />
            }
        </div>
    )
}

export default Menu;