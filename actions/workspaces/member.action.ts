"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUser } from "../auth.action";
import prisma from "@/lib/prisma";
import { WorkspaceMember } from "@prisma/client";
import { redirect } from "next/navigation";

export async function findWorkspaceMember(): Promise<WorkspaceMember | null> {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/sign-in");

    const { user } = session;
    const userDB = await findUser(user.email!);

    if (!userDB) {
        throw new Error("Unauthorized access");
    }

    const workspaceMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: userDB.id,
            OR: [
                { role: "owner" },
                { role: "invited" }
            ]
        }
    })

    return workspaceMember;
}