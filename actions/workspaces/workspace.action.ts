"use server";

import { Workspace } from "@prisma/client";
import prisma from "@/lib/prisma";
import { isUUID } from "@/utils/isUUID";
import { getAuthorizedUser } from "../auth.action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type State = { error?: string; } | null;

export async function revalidateDashboard() {
    return revalidatePath("/dashboard");
}

export async function createWorkspace(
    _previousState: State,
    formData: FormData
) {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const workspaceName = formData.get("workspace") as string;

    if (!workspaceName) return { error: "Workspace name is required" }

    const workspace = await prisma.workspace.create({
        data: {
            name: workspaceName
        }
    })

    if (!workspace) return { error: "Failed to create workspace" }

    const workspaceMember = await prisma.workspaceMember.create({
        data: {
            workspaceId: workspace.id,
            userId: user.id,
            role: "owner"
        }
    })

    if (!workspaceMember) {
        return {
            error: "An error occurred while adding you to your workspace."
        }
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/${workspace.id}`);
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
    if (!isUUID(id)) return null;

    const workspace = await prisma.workspace.findUnique({
        where: {
            id
        }
    })

    return workspace;
}

export async function getWorkspaceCountByUser(): Promise<number> {
    const user = await getAuthorizedUser();

    if (!user) return 0;

    const count = await prisma.workspace.count({
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    })

    return count;
}