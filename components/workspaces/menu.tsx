"use client";

import { Home, Inbox, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const menuItems = [
    {
        icon: <Home size={18} />,
        label: "Home"
    },
    {
        icon: <MessageCircle size={18} />,
        label: "Chat"
    },
    {
        icon: <Inbox size={18} />,
        label: "Inbox"
    }
]

const Menu = () => {
    const [activeBar, setActiveBar] = useState(0);
    const [displayedLabel, setDisplayedLabel] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(()=> {
        setCurrentIndex(0);
        setDisplayedLabel("");
    }, [activeBar])

    useEffect(() => {
        const currentLabel = menuItems[activeBar].label;

        if (currentIndex >= currentLabel.length) return;

        const timeout = setTimeout(() => {
            setDisplayedLabel(prev => prev + currentLabel[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, 20);

        return () => clearTimeout(timeout);
    }, [currentIndex])

    return ( 
        <div className="flex items-center gap-3">
            {
                menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={`
                            ${activeBar === index ? "bg-neutral-700/5" : "cursor-pointer"}
                            flex items-center gap-1
                            rounded-full
                            px-2 py-1
                        `}
                        onClick={() => setActiveBar(index)}
                    >
                        {item.icon}
                        <h1 
                            className={
                            `
                                ${activeBar === index ? "block" : "hidden"}
                                text-sm font-medium
                            `
                        }>
                            {displayedLabel}
                        </h1>
                    </div>
                ))
            }
        </div>
    )
}
 
export default Menu;