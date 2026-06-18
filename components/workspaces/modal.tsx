"use client";

import { Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    useActionState,
    useEffect,
    useState
} from "react";
import SignOut from "../sign-out";
import { Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ModalUI } from "../ui/modal";
import { Input } from "../ui/input";
import { createWorkspace } from "@/actions/workspaces/workspace.action";
import RenderItems from "./dnd/renderItems";
import { RoleType } from "@/stores/zustands/use-role";
import { OrderItem } from "./dnd/orderItems";
import { setWorkspaceMemberPosition } from "@/actions/workspaces/member.action";
import { WorkspacePosition } from "@/types/workspacePosition";

interface ModalProps {
    isOpen: boolean;
    workspace: Workspace | null;
    role: RoleType;
    workspacesPosition: WorkspacePosition[];
}

export const Modal = ({
    isOpen,
    workspace,
    role,
    workspacesPosition
}: ModalProps) => {
    const { data } = useSession();
    const currentUser = data?.user;

    const [isCreateWorkspace, setIsCreateWorkspace] = useState<boolean>(false);
    const [state, action, pending] = useActionState(createWorkspace, null);

    const [opacity, setOpacity] = useState("opacity-0 -translate-y-2");

    const {
        id: workspaceId,
        name,
        plan
    } = workspace!;

    const initialWorkspaces = workspacesPosition.filter(workspace => workspace.id !== workspaceId)
        .map(item => ({
            id: item.id,
            orderId: item.workspaceMemberId,
            name: item.name,
            link: `/dashboard/${item.id}`
        }))

    const handleReorder = async (items: OrderItem[]) => {
        setWorkspaceMemberPosition(items.map(item => item.orderId as string))
    }

    useEffect(() => {
        if (!isOpen) {
            setOpacity("opacity-0 -translate-y-2");
            return;
        }

        setOpacity("opacity-100 translate-y-0");
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`
                    absolute top-10 left-0 z-60 w-full transition-all duration-200
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
                            <div className="flex items-center gap-2 text-black/50">
                                {
                                    role === "owner" &&
                                    <Link
                                        className="cursor-pointer hover:scale-105 transition-transform"
                                        href={`/dashboard/${workspaceId}/setting`}
                                    >
                                        <Settings size={14} />
                                    </Link>
                                }
                                <span className=" text-xs">{plan} plan</span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-3 px-4">
                        <p className="text-sm">{currentUser?.email}</p>
                        <RenderItems
                            initialItems={initialWorkspaces}
                            handleReorder={handleReorder}
                        />
                        <Link
                            className="flex items-center gap-2 hover:bg-primary/5 rounded-sm cursor-pointer px-2 py-1"
                            href={`/dashboard/${workspaceId}`}
                        >
                            <div>
                                <Image
                                    src="/icons/3d-house.png"
                                    alt="3d-house"
                                    width={18}
                                    height={18}
                                />
                            </div>
                            <p className={`truncate ${role === "invited" ? "w-25" : "w-40"}`}>
                                {name}
                            </p>
                            {
                                role === "invited" &&
                                <span className="text-yellow-600 text-xs px-1.5 py-1 rounded-sm bg-yellow-600/10">
                                    {role}
                                </span>
                            }
                        </Link>
                        <div
                            className="flex items-center gap-2 rounded-sm
                            cursor-pointer hover:bg-primary/5 px-2 py-1 text-blue-700"
                            onClick={() => setIsCreateWorkspace(true)}
                            role="button"
                        >
                            <Plus size={18} />
                            <h1>
                                New workspace
                            </h1>
                        </div>
                    </div>
                    <hr />
                    <div className="px-4">
                        <SignOut />
                    </div>
                </div>
            </div>
            <ModalUI
                isOpen={isCreateWorkspace}
                onClose={() => setIsCreateWorkspace(false)}
            >
                <form action={action} className="flex flex-col gap-4 p-6">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                        Create workspace *
                    </h2>
                    <Input
                        id="workspace"
                        name="workspace"
                        type="workspace"
                        className="h-10 focus-visible:ring-2"
                        placeholder="Workspace name"
                        required
                    />
                    {
                        state?.error &&
                        <span className="text-xs text-red-500">
                            {
                                state?.error
                            }
                        </span>
                    }
                    <Button
                        className="h-10 cursor-pointer hover:bg-primary/90 disabled:opacity-70"
                        type="submit"
                        disabled={pending}
                    >
                        {
                            pending ?
                                "Creating ..."
                                :
                                "Create"
                        }
                    </Button>
                </form>
            </ModalUI>
        </>
    )
}