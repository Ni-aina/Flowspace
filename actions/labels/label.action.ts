"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Label } from "@prisma/client";

export const getWorkspaceLabels = async (workspaceId: string): Promise<Label[]> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    return prisma.label.findMany({
        where: { workspaceId }
    })
}