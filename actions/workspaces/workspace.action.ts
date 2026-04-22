"use server";

import { Workspace } from "@prisma/client";
import prisma from "@/lib/prisma";
import { isUUID } from "@/utils/isUUID";

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
    if (!isUUID(id)) return null;

    const workspace = await prisma.workspace.findUnique({
        where: {
            id
        }
    })

    return workspace;
}