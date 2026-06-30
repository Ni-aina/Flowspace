"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Board } from "@prisma/client";
import { emitToRoom } from "@/lib/realtime";
import { WorkspaceEvent } from "@/types/realtime";
import { revalidatePath } from "next/cache";

type State = { error?: string; success?: boolean }

export async function createBoard(
    _previousState: State | null,
    formData: FormData
): Promise<State> {
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

    emitToRoom(
        `workspace:${workspaceId}:board`,
        "workspace:event",
        {
            entity: "board",
            action: "created",
            room: `workspace:${workspaceId}:board`,
            payload: board
        } satisfies WorkspaceEvent
    )

    return {
        success: true
    }
}

export async function updateBoard(
    _previousState: State | null,
    formData: FormData
): Promise<State> {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const boardId = formData.get("boardId") as string;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!boardId) return { error: "Board ID is required" }
    if (!title) return { error: "Title is required" }
    if (!workspaceId) return { error: "Workspace ID is required" }

    const board = await prisma.board.update({
        where: {
            id: boardId,
            workspace: {
                id: workspaceId,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        },
        data: {
            title,
            type
        }
    })

    if (!board) return { error: "Failed to update board" }

    emitToRoom(
        `workspace:${workspaceId}:board`,
        "workspace:event",
        {
            entity: "board",
            action: "updated",
            room: `workspace:${workspaceId}:board`,
            payload: board
        } satisfies WorkspaceEvent
    )

    revalidatePath(`/dashboard/boards/${board.id}`)

    return {
        success: true
    }
}

export async function deleteBoard(boardId: string): Promise<{ success: boolean }> {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    if (!boardId) throw new Error("Board ID is required");

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
            workspace: {
                include: {
                    members: {
                        where: {
                            userId: user.id
                        }
                    }
                }
            }
        }
    })

    if (!board) throw new Error("Board not found")

    if (board.workspace.members.length === 0) throw new Error("Unauthorized")

    await prisma.board.delete({
        where: { id: boardId }
    })

    emitToRoom(
        `workspace:${board.workspaceId}:board`,
        "workspace:event",
        {
            entity: "board",
            action: "deleted",
            room: `workspace:${board.workspaceId}:board`,
            payload: board
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export async function getBoardById(boardId: string): Promise<Board> {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    if (!boardId) throw new Error("Board ID is required");

    const board = await prisma.board.findUnique({
        where: {
            id: boardId,
            workspace: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        }
    })

    if (!board) throw new Error("Board not found");

    return board;
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
        },
        orderBy: {
            position: "asc"
        }
    })

    return boards;
}

export const setBoardPositions = async (workspaceId: string, boardIds: string[])
    : Promise<Board[]> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    const boards = await Promise.all(
        boardIds.map((id, position) =>
            prisma.board.update({
                where: { id },
                data: { position }
            })
        )
    )

    emitToRoom(
        `workspace:${workspaceId}:board`,
        "workspace:event",
        {
            entity: "board",
            action: "moved",
            room: `workspace:${workspaceId}:board`,
            payload: boards
        } satisfies WorkspaceEvent
    )

    return boards;
}

export const getBoardCountByUser = async (): Promise<number> => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.board.count({ where: { workspace: { members: { some: { userId: user.id } } } } })
}