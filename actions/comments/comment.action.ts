"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { getCardWithAccess } from "../cards/card.action";
import { CommentWithAuthor } from "../cards/details.action";

type State = {
    comment?: CommentWithAuthor;
    error?: string;
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
        data: { cardId, authorId: user.id, body },
        include: { author: { select: { id: true, name: true, avatarUrl: true } } }
    })

    if (!comment) return {
        error: "Failed to add comment"
    }

    return { comment }
}

export const deleteComment = async (commentId: string) => {
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
}