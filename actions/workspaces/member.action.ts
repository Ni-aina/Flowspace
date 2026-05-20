"use server";

import { getAuthorizedUser } from "../auth.action";
import prisma from "@/lib/prisma";
import { WorkspacePosition } from "@/types/workspacePosition";
import { WorkspaceMember } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function findWorkspaceMember(workspaceId?: string): Promise<WorkspaceMember | null> {
    const user = await getAuthorizedUser();

    if (!user) {
        throw new Error("Unauthorized access");
    }

    if (workspaceId) {
        const workspaceMember = await prisma.workspaceMember.findFirst({
            where: {
                userId: user.id,
                workspaceId: workspaceId
            }
        })

        return workspaceMember;
    }

    const workspaceMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: user.id,
            OR: [
                { role: "owner" },
                { role: "invited" }
            ]
        },
        orderBy: {
            lastUsed: "desc"
        }
    })

    return workspaceMember;
}

export async function setWorkspaceLastUsed(id: string) {
    const user = await getAuthorizedUser();

    if (!user) {
        throw new Error("Unauthorized access");
    }

    const now = new Date().toISOString();

    await prisma.workspaceMember.update({
        where: {
            id,
            userId: user.id
        },
        data: {
            lastUsed: now
        }
    })
}

export async function setWorkspaceMemberPosition(workspaceIds: string[]) {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    await Promise.all(
        workspaceIds.map((id, position) =>
            prisma.workspaceMember.update({
                where: { id },
                data: { position }
            })
        )
    )

    revalidatePath("/dashboard");
}

export async function getWorkspacesPosition(): Promise<WorkspacePosition[]> {
    const user = await getAuthorizedUser();

    if (!user) return [];

    const workspaces = await prisma.workspaceMember.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            position: true,
            workspace: {
                select: {
                    id: true,
                    name: true,
                    plan: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    })

    return workspaces.map(item => ({
        workspaceMemberId: String(item.id),
        position: item.position,
        ...item.workspace
    }))
}