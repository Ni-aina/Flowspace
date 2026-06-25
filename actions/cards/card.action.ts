"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Card } from "@prisma/client";
import { emitToRoom } from "@/lib/realtime";
import { WorkspaceEvent } from "@/types/realtime";

type State = { error?: string; success?: boolean }

const getCardWithAccess = async (cardId: string, userId: string) => {
    return prisma.card.findUnique({
        where: {
            id: cardId,
            list: {
                board: {
                    workspace: {
                        members: {
                            some: { userId }
                        }
                    }
                }
            }
        },
        include: {
            list: {
                include: { board: true }
            }
        }
    })
}

export const createCard = async (
    _previousState: State | null,
    formData: FormData
): Promise<State> => {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const description = formData.get("description") as string | null;
    const dueDate = formData.get("dueDate") as string | null;

    if (!title) return { error: "Title is required" }
    if (!listId) return { error: "List ID is required" }

    const [
        list,
        lastPositionCard
    ] = await Promise.all([
        prisma.list.findUnique({
            where: {
                id: listId,
                board: {
                    workspace: {
                        members: {
                            some: { userId: user.id }
                        }
                    }
                }
            },
            include: { board: true }
        }),
        prisma.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                position: "desc"
            }
        })
    ])

    if (!list) return { error: "List not found" }

    const position = lastPositionCard?.position ? lastPositionCard.position + 1 : 1

    const card = await prisma.card.create({
        data: {
            title,
            listId,
            createdBy: user.id,
            description: description || null,
            dueDate: dueDate ? new Date(dueDate) : null,
            position
        }
    })

    if (!card) return { error: "Failed to create card" }

    emitToRoom(
        `workspace:${list.board.workspaceId}:list:${listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "created",
            room: `workspace:${list.board.workspaceId}:list:${listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const updateCard = async (
    _previousState: State | null,
    formData: FormData
): Promise<State> => {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const cardId = formData.get("cardId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const dueDate = formData.get("dueDate") as string | null;
    const position = formData.get("position") as string;

    if (!cardId) return { error: "Card ID is required" }
    if (!title) return { error: "Title is required" }

    const existing = await getCardWithAccess(cardId, user.id);

    if (!existing) return { error: "Card not found" }

    const card = await prisma.card.update({
        where: { id: cardId },
        data: {
            title,
            description: description ?? existing.description,
            dueDate: dueDate ? new Date(dueDate) : existing.dueDate,
            position: position ? +position : existing.position
        }
    })

    emitToRoom(
        `workspace:${existing.list.board.workspaceId}:list:${existing.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "updated",
            room: `workspace:${existing.list.board.workspaceId}:list:${existing.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const deleteCard = async (cardId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")
    if (!cardId) throw new Error("Card ID is required")

    const card = await getCardWithAccess(cardId, user.id);

    if (!card) throw new Error("Card not found")

    await prisma.card.delete({ where: { id: cardId } })

    emitToRoom(
        `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "deleted",
            room: `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const getCardsGroupedByListId = async (boardId: string): Promise<Record<string, Card[]>> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")
    if (!boardId) throw new Error("Board ID is required")

    const cards = await prisma.card.findMany({
        where: {
            list: {
                boardId,
                board: {
                    workspace: {
                        members: {
                            some: { userId: user.id }
                        }
                    }
                }
            }
        },
        orderBy: { position: "asc" }
    })

    return cards.reduce((acc, card) => {
        if (!acc[card.listId])
            acc[card.listId] = []

        acc[card.listId].push(card)

        return acc
    }, {} as Record<string, Card[]>)
}

export const setCardPositions = async (
    workspaceId: string,
    listId: string,
    cardIds: string[]
): Promise<Card[]> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")

    const cards = await Promise.all(
        cardIds.map((id, position) =>
            prisma.card.update({
                where: { id },
                data: { position }
            })
        )
    )

    emitToRoom(
        `workspace:${workspaceId}:list:${listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "moved",
            room: `workspace:${workspaceId}:list:${listId}`,
            payload: cards
        } satisfies WorkspaceEvent
    )

    return cards
}

export const moveCard = async (cardId: string, targetListId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")
    if (!cardId) throw new Error("Card ID is required")
    if (!targetListId) throw new Error("Target list ID is required")

    const [
        existing,
        lastPositioncard
    ] = await Promise.all([
        getCardWithAccess(cardId, user.id),
        prisma.card.findFirst({
            where: {
                listId: targetListId
            },
            orderBy: {
                position: "desc"
            }
        })
    ])

    if (!existing) throw new Error("Card not found")

    const position = lastPositioncard?.position ? lastPositioncard.position + 1 : 1

    const card = await prisma.card.update({
        where: { id: cardId },
        data: { listId: targetListId, position }
    })

    emitToRoom(
        `workspace:${existing.list.board.workspaceId}:list:${card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "created",
            room: `workspace:${existing.list.board.workspaceId}:list:${card.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )


    emitToRoom(
        `workspace:${existing.list.board.workspaceId}:list:${existing.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "deleted",
            room: `workspace:${existing.list.board.workspaceId}:list:${existing.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const assignCard = async (cardId: string, userId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")

    const card = await getCardWithAccess(cardId, user.id);

    if (!card) throw new Error("Card not found")

    await prisma.cardAssignee.upsert({
        where: { cardId_userId: { cardId, userId } },
        create: { cardId, userId },
        update: {}
    })

    emitToRoom(
        `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "updated",
            room: `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const unassignCard = async (cardId: string, userId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")

    const card = await getCardWithAccess(cardId, user.id);

    if (!card) throw new Error("Card not found")

    await prisma.cardAssignee.delete({
        where: { cardId_userId: { cardId, userId } }
    })

    emitToRoom(
        `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "updated",
            room: `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
            payload: card
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const addComment = async (
    _previousState: State | null,
    formData: FormData
): Promise<State> => {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }

    const cardId = formData.get("cardId") as string;
    const body = formData.get("body") as string;

    if (!cardId) return { error: "Card ID is required" }
    if (!body) return { error: "Comment body is required" }

    const card = await getCardWithAccess(cardId, user.id);

    if (!card) return { error: "Card not found" }

    const comment = await prisma.comment.create({
        data: { cardId, authorId: user.id, body }
    })

    emitToRoom(
        `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "updated",
            room: `workspace:${card.list.board.workspaceId}:list:${card.listId}`,
            payload: comment
        } satisfies WorkspaceEvent
    )

    return { success: true }
}

export const deleteComment = async (commentId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")
    if (!commentId) throw new Error("Comment ID is required")

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            card: {
                include: { list: { include: { board: true } } }
            }
        }
    })

    if (!comment) throw new Error("Comment not found")
    if (comment.authorId !== user.id) throw new Error("Unauthorized")

    await prisma.comment.delete({ where: { id: commentId } })

    emitToRoom(
        `workspace:${comment.card.list.board.workspaceId}:list:${comment.card.listId}`,
        "workspace:event",
        {
            entity: "card",
            action: "updated",
            room: `workspace:${comment.card.list.board.workspaceId}:list:${comment.card.listId}`,
            payload: comment
        } satisfies WorkspaceEvent
    )

    return { success: true }
}