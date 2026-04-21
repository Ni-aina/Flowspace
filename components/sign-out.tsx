"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SignOut = () => {
    return (
        <div
            role="button"
            className="inline-flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform px-2"
            onClick={() => signOut()}
        >
            <h1>Sign out</h1>
            <LogOut
                size={18}
            />
        </div>
    )
}
 
export default SignOut;