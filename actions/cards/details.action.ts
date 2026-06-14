"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { Comment, Attachment, Block } from "@prisma/client";

export type CommentWithAuthor = Comment & {
    author: { id: string; name: string; avatarUrl: string | null }
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

export const getCardBlocks = async (cardId: string): Promise<Block[]> => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.block.findMany({
        where: { cardId, parentBlockId: null },
        orderBy: { position: "asc" }
    })
}

export const getCardAssignees = async (cardId: string) => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.cardAssignee.findMany({
        where: { cardId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } }
    })
}

export const getCardLabels = async (cardId: string) => {
    const user = await getAuthorizedUser();
    if (!user) throw new Error("Unauthorized");
    return prisma.cardLabel.findMany({
        where: { cardId },
        include: { label: true }
    })
}