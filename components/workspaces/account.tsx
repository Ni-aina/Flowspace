"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Modal } from "./modal";
import { useEffect, useRef, useState } from "react";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useRole } from "@/stores/zustands/use-role";
import { WorkspacePosition } from "@/types/workspacePosition";
import CardLoading from "../card-loading";

interface AccountProps {
    workspacesPosition: WorkspacePosition[];
}

export const Account = ({ workspacesPosition }: AccountProps) => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;

    const role = useRole(state => state.role);

    const [isOpen, setIsOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    useEffect(() => {
        if (!workspaceId) return;
        setIsOpen(false);
    }, [workspaceId])

    if (!workspace) return (
        <div className="mb-5">
            <CardLoading />
        </div>
    )

    return (
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
                    <div className="flex flex-1 justify-between items-center gap-1">
                        <div className="flex items-center gap-1">
                            <p className="text-md truncate w-28">
                                {workspace?.name}
                            </p>
                            {
                                role === "invited" &&
                                <span className="text-yellow-600 text-xs px-1.5 py-1 rounded-sm bg-yellow-600/10">
                                    {role}
                                </span>
                            }
                        </div>
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
                role={role}
                isOpen={isOpen}
                workspace={workspace}
                workspacesPosition={workspacesPosition}
            />
        </div>
    )
}