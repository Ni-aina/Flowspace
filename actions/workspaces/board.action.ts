"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Board } from "@prisma/client";

type State = { error?: string; success?: boolean }

export async function createBoard(
    _previousState: State | null,
    formData: FormData
) {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!title) return { error: "Title is required" }
    if (!workspaceId) return { error: "Workspace ID is required" }

    const board = await prisma.board.create({
        data: {
            title,
            type: type || "grid",
            workspaceId,
            createdBy: user.id
        }
    })

    if (!board) return { error: "Failed to create board" }

    return {
        success: true
    }
}

export async function getBoardsByWorkspaceId(workspaceId: string): Promise<Board[]> {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    if (!workspaceId) throw new Error("Workspace ID is required");

    const boards = await prisma.board.findMany({
        where: {
            workspace: {
                id: workspaceId,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        }
    })

    return boards;
}

export async function setBoardPosition(boardId: string, position: number) {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    const board = await prisma.board.update({
        where: {
            id: boardId
        },
        data: {
            position
        }
    })

    return board;
}