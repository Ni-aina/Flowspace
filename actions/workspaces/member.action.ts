"use server";

import { getAuthorizedUser } from "../auth.action";
import prisma from "@/lib/prisma";
import { WorkspaceMember } from "@prisma/client";

export async function findWorkspaceMember(): Promise<WorkspaceMember | null> {
    const user = await getAuthorizedUser();

    if (!user) {
        throw new Error("Unauthorized access");
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