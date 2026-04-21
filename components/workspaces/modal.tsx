"use client";

import { BriefcaseBusiness, House } from "lucide-react";
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
                absolute top-10 left-0 z-50 w-full transition-all duration-200 
                ${opacity}
            `}
        >
            <div className="p-3 flex flex-col space-y-3 bg-white rounded-sm">
                <div className="flex items-center gap-3">
                    <House/>
                    <div >
                            <p>Ni aina's Space </p>
                            <span className="text-sm">Invited</span>
                    </div> 
                </div>
                <hr />
                <p>elie.savio.k@gmail.com</p>
                <div className="flex gap-2">
                    <BriefcaseBusiness size={16}/>
                    <p>Espace de elie savio</p>
                </div>
                <div className="flex gap-2">
                    <p className="bg-primary/5 p-1  rounded-xs text-sm">
                        E
                    </p>
                    <p>Espace de elie savio</p>
                </div>
                <div className="flex gap-2">
                    <House size={14}/>
                    <div >
                        <p>Ni aina"s Space </p>
                        <span className="text-sm">Invited</span>
                    </div>
                </div> 
                
            </div>
        </div>
    )
}