"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Modal } from "./modal";
import { useEffect, useRef, useState } from "react";

export const Account = () => {
    const [isOpen, setIsOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=> {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return(
        <div 
            className="relative"
            ref={accountRef}
        >
            <div 
                className="p-2 hover:bg-primary/5 rounded-sm cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/3d-house.png"
                        alt="3d-house"
                        width={20}
                        height={20}
                    />
                    <div className="flex items-center gap-1">
                    <p className="text-md">
                            Ni aina's Space <span className="text-yellow-600 text-xs px-1.5 py-1 rounded-sm bg-yellow-600/10">Invited</span>
                        </p>
                        <ChevronDown size={14}
                            className="transition-all duration-200"
                            style={{
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                        />
                    </div>
                </div>
            </div>  
            <Modal 
                isOpen={isOpen} 
            />
        </div>
    )
}