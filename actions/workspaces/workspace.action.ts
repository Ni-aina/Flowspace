"use server";

import { Workspace } from "@prisma/client";
import prisma from "@/lib/prisma";
import { isUUID } from "@/utils/isUUID";
import { getAuthorizedUser } from "../auth.action";

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
    if (!isUUID(id)) return null;

    const workspace = await prisma.workspace.findUnique({
        where: {
            id
        }
    })

    return workspace;
}

export async function getWorkspaces(): Promise<Workspace[]> {
    const user = await getAuthorizedUser();

    if (!user) {
        throw new Error("Unauthorized access");
    }

    const workspaces = await prisma.workspaceMember.findMany({
        where: {
            userId: user.id
        },
        select: {
            workspace: {
                select: {
                    id: true,
                    name: true,
                    plan: true,
                    createdAt: true
                }
            }
        }
    })

    return workspaces.map(workspaceMember => workspaceMember.workspace)
}