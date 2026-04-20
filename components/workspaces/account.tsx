"use client";

import { ChevronDown, House } from "lucide-react";

export const Account = () => {
    
    return(
        <div className="p-2 hover:bg-primary/10 rounded-sm cursor-pointer">
            <div className="flex items-center gap-2">
                <House size={18}/>
                <div className="flex items-center gap-1">
                   <p>
                        Ni aina's Space <span className="text-yellow-600 text-xs px-1.5 py-1 rounded-sm bg-yellow-600/10">Invited</span>
                    </p>
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    )
}