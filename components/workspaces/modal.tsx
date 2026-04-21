"use client";

import { BriefcaseBusiness, House, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ModalProps {
    isOpen: boolean;
}

export const Modal = ({ isOpen }: ModalProps) => {
    const [opacity, setOpacity] = useState("opacity-0 -translate-y-2");

    useEffect(() => {
        if (!isOpen) {
            setOpacity("opacity-0 -translate-y-2");
            return;
        }
        const timer = setTimeout(() => {
            setOpacity("opacity-100 translate-y-0");
        }, 100);
        
        return () => clearTimeout(timer);
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div 
            className={`
                absolute top-12 left-0 z-50 w-full transition-all duration-300 
                ${opacity}
            `}
        >
            <div className="flex flex-col space-y-3 bg-white rounded-sm py-2">
                <div className="flex items-center gap-3 px-4 ">
                    <Image
                        src="/icons/3d-house.png"
                        alt="3d-house"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col space-y-0">
                        <p>Ni aina's Space </p>
                        <span className=" text-xs  text-black/50 ">Invited</span>
                    </div> 
                </div>
                <hr />
                <div className="flex flex-col gap-3 px-4">
                    <p className="text-sm">elie.savio.k@gmail.com</p>
                    <div className="flex items-center gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1">
                        <BriefcaseBusiness size={16}/>
                        <p>Espace de elie savio</p>
                    </div>
                    <div className="flex gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1">
                        <p className="bg-primary/5 p-1  rounded-xs text-sm">
                            E
                        </p>
                        <p>Espace de elie savio</p>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1">
                        <div>
                            <Image
                                src="/icons/3d-house.png"
                                alt="3d-house"
                                width={18}
                                height={18}
                            />
                        </div>
                        <p className="truncate w-20">Ni aina"s Space </p>
                        <span className="text-xs px-2 py-1 bg-yellow-600/5 text-yellow-600 rounded-sm">Invited</span>
                    </div> 
                    <div className="flex items-center gap-2 text-blue-700">
                        <div >
                            <Plus size={18}/>
                        </div>
                        <Link 
                            href="#"
                            className=""
                        >
                            New workspace
                        </Link>
                    </div>
                </div>
                <hr />
                <div className="px-4">
                    <h1>
                        Sign out
                    </h1>
                </div>
            </div>
        </div>
    )
}