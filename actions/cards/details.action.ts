"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Card, Comment, Attachment } from "@prisma/client";

export type CardWithAssignees = Card & {
    assignees: {
        user: {
            id: string;
            name: string;
        }
    }[]
}

export type CommentWithAuthor = Comment & {
    author: { id: string; name: string; avatarUrl: string | null }
}

export const getCardAssignees = async (cardId: string) => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.cardAssignee.findMany({
        where: { cardId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } }
    })
}

export const getCardComments = async (cardId: string): Promise<CommentWithAuthor[]> => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.comment.findMany({
        where: { cardId },
        include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: "asc" }
    })
}

export const getCardAttachments = async (cardId: string): Promise<Attachment[]> => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.attachment.findMany({ where: { cardId } })
}

export const getCardCountByUser = async (workspaceId: string): Promise<number> => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");

    if (!workspaceId) throw new Error("Workspace id is required");

    return prisma.cardAssignee.count({
        where: {
            card: {
                list: {
                    board: {
                        workspaceId
                    }
                }
            },
            userId: user.id
        }
    })
}