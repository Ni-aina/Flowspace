"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { List } from "@prisma/client";
import { emitToRoom } from "@/lib/realtime";
import { WorkspaceEvent } from "@/types/realtime";

type State = { error?: string; success?: boolean }

export async function createList(
    _previousState: State | null,
    formData: FormData
): Promise<State> {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const title = formData.get("title") as string;
    const color = formData.get("color") as string;
    const boardId = formData.get("boardId") as string;

    if (!title) return { error: "Title is required" }
    if (!boardId) return { error: "Board ID is required" }

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

    if (!board) return { error: "Board not found" }

    const list = await prisma.list.create({
        data: {
            title,
            color: color || "#6366f1",
            boardId
        }
    })

    if (!list) return { error: "Failed to create list" }

    emitToRoom(
        `workspace:${board.workspaceId}`,
        "workspace:event",
        {
            entity: "list",
            action: "created",
            room: `workspace:${board.workspaceId}`,
            payload: list
        } satisfies WorkspaceEvent
    )

    return {
        success: true
    }
}

export async function updateList(
    _previousState: State | null,
    formData: FormData
): Promise<State> {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const listId = formData.get("listId") as string;
    const title = formData.get("title") as string;
    const color = formData.get("color") as string;
    const position = formData.get("position") as string;

    if (!listId) return { error: "List ID is required" }
    if (!title) return { error: "Title is required" }

    const existing = await prisma.list.findUnique({
        where: {
            id: listId,
            board: {
                workspace: {
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                }
            }
        },
        include: {
            board: true
        }
    })

    if (!existing) return { error: "List not found" }

    const list = await prisma.list.update({
        where: { id: listId },
        data: {
            title,
            color: color || existing.color,
            position: +position
        }
    })

    emitToRoom(
        `workspace:${existing.board.workspaceId}`,
        "workspace:event",
        {
            entity: "list",
            action: "updated",
            room: `workspace:${existing.board.workspaceId}`,
            payload: list
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export async function deleteList(listId: string): Promise<{ success: boolean; }> {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    if (!listId) throw new Error("List ID is required");

    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: {
            board: {
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
            }
        }
    })

    if (!list) throw new Error("List not found")

    if (list.board.workspace.members.length === 0) throw new Error("Unauthorized")

    await prisma.list.delete({
        where: { id: listId }
    })

    emitToRoom(
        `workspace:${list.board.workspaceId}`,
        "workspace:event",
        {
            entity: "list",
            action: "deleted",
            room: `workspace:${list.board.workspaceId}`,
            payload: list
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const getListsByBoardId = async (boardId: string): Promise<List[]> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    if (!boardId) throw new Error("Board ID is required");

    const lists = await prisma.list.findMany({
        where: {
            boardId,
            board: {
                workspace: {
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    })

    return lists;
}

export const setListPositions = async (workspaceId: string, listIds: string[])
    : Promise<List[]> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized");

    const lists = await Promise.all(
        listIds.map((id, position) =>
            prisma.list.update({
                where: { id },
                data: { position }
            })
        )
    )

    emitToRoom(
        `workspace:${workspaceId}`,
        "workspace:event",
        {
            entity: "list",
            action: "moved",
            room: `workspace:${workspaceId}`,
            payload: lists
        } satisfies WorkspaceEvent
    )

    return lists;
}