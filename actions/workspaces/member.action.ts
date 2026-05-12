"use server";

import { getAuthorizedUser } from "../auth.action";
import prisma from "@/lib/prisma";
import { WorkspaceMember } from "@prisma/client";

export async function findWorkspaceMember(workspaceId: string): Promise<WorkspaceMember | null> {
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
        }
    })

    return workspaceMember;
}