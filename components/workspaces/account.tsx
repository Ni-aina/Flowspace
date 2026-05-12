"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Modal } from "./modal";
import { useEffect, useRef, useState } from "react";
import { Workspace } from "@prisma/client";
import { useWorkspaceMember } from "@/stores/zustands/use-workspace-member";
import { getWorkspaceById, revalidateDashboard } from "@/actions/workspaces/workspace.action";

interface AccountProps {
    workspaces: Workspace[];
}

export const Account = ({ workspaces }: AccountProps) => {
    const member = useWorkspaceMember(state => state.workspaceMember);

    if (!member) return null;
    const { role, workspaceId } = member;

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!workspaceId) return;
        (async () => {
            const workspace = await getWorkspaceById(workspaceId);
            await revalidateDashboard();
            setWorkspace(workspace);
        })()
    }, [workspaceId])

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

    if (!workspace) return null;

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
                                <span className="text-yellow-600 text-xs px-1.5 py-1 rounded-sm bg-yellow-600/10">{role}</span>
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
                workspaces={workspaces}
            />
        </div>
    )
}