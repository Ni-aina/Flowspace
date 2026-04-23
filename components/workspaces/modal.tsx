"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useState
} from "react";
import SignOut from "../sign-out";
import { Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";

interface ModalProps {
    isOpen: boolean;
    workspace: Workspace | null;
    role: string;
    workspaces: Workspace[];
}

export const Modal = ({
    isOpen,
    workspace,
    role,
    workspaces
}: ModalProps) => {
    const { data } = useSession();
    const currentUser = data?.user;

    const [opacity, setOpacity] = useState("opacity-0 -translate-y-2");

    const {
        id,
        name,
        plan,
        createdAt,
    } = workspace!;

    useEffect(() => {
        if (!isOpen) {
            setOpacity("opacity-0 -translate-y-2");
            return;
        }

        setOpacity("opacity-100 translate-y-0");
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div
            className={`
                absolute top-12 left-0 z-50 w-full transition-all duration-200
                ${opacity}
            `}
        >
            <div className="flex flex-col space-y-3 rounded-sm py-2 bg-white">
                <div className="flex items-center gap-3 px-4 ">
                    <Image
                        src="/icons/3d-house.png"
                        alt="3d-house"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col space-y-0">
                        <p className="truncate w-40">{name}</p>
                        <span className=" text-xs  text-black/50 ">{plan} plan</span>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col gap-3 px-4">
                    <p className="text-sm">{currentUser?.email}</p>
                    {
                        workspaces.map(workspace =>
                            <div
                                key={workspace.id}
                                className="flex items-center gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1"
                            >
                                <div className="flex h-full items-center bg-primary/5 px-1 rounded-xs">
                                    <h1 className="text-sm">
                                        {workspace.name[0].toUpperCase()}
                                    </h1>
                                </div>
                                <p className="truncate w-40">{workspace.name}</p>
                            </div>
                        )
                    }
                    <div className="flex items-center gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1">
                        <div>
                            <Image
                                src="/icons/3d-house.png"
                                alt="3d-house"
                                width={18}
                                height={18}
                            />
                        </div>
                        <p className="truncate w-40">{name}</p>
                        {
                            role === "invited" &&
                            <span className="text-xs px-2 py-1 bg-yellow-600/5 text-yellow-600 rounded-sm">Invited</span>
                        }
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                        <div >
                            <Plus size={18} />
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
                    <SignOut />
                </div>
            </div>
        </div>
    )
}