"use server";

import prisma from "@/lib/prisma";
import { getAuthorizedUser } from "../auth.action";
import { getCardWithAccess } from "../cards/card.action";
import { Attachment } from "@prisma/client";
import { UTApi } from "uploadthing/server";

type AttachmentState = {
    attachments?: Attachment[];
    error?: string;
}

type CreateAttachmentInput = {
    cardId: string;
    url: string;
    uploadKey: string;
    filename: string;
    sizeBytes: number;
}

const utapi = new UTApi();

export const addAttachments = async (items: CreateAttachmentInput[]): Promise<AttachmentState> => {
    const user = await getAuthorizedUser();

    if (!user) return { error: "Unauthorized" }
    if (!items.length) return { error: "Attachment is required" }

    const card = await getCardWithAccess(items[0].cardId, user.id);

    if (!card) return { error: "Card not found" }

    const invalidItem = items.find(item => item.cardId !== items[0].cardId || !item.url || !item.uploadKey || !item.filename);

    if (invalidItem) return { error: "Invalid attachment" }

    await prisma.attachment.createMany({
        data: items.map(item => ({
            cardId: item.cardId,
            url: item.url,
            uploadKey: item.uploadKey,
            filename: item.filename,
            sizeBytes: item.sizeBytes,
            uploadedBy: user.id
        })),
        skipDuplicates: true
    })

    const attachments = await prisma.attachment.findMany({
        where: {
            cardId: items[0].cardId
        },
        orderBy: {
            filename: "asc"
        }
    })

    return { attachments }
}

export const deleteAttachment = async (attachmentId: string): Promise<{ success: boolean }> => {
    const user = await getAuthorizedUser();

    if (!user) throw new Error("Unauthorized")
    if (!attachmentId) throw new Error("Attachment ID is required")

    const attachment = await prisma.attachment.findUnique({
        where: {
            id: attachmentId
        },
        include: {
            card: {
                include: {
                    list: {
                        include: {
                            board: {
                                include: {
                                    workspace: {
                                        include: {
                                            members: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!attachment) throw new Error("Attachment not found")

    const hasAccess = attachment.card.list.board.workspace.members.some(member => member.userId === user.id);

    if (!hasAccess) throw new Error("Unauthorized")

    if (attachment.uploadKey) {
        await utapi.deleteFiles(attachment.uploadKey);
    }

    await prisma.attachment.delete({
        where: {
            id: attachmentId
        }
    })

    return { success: true }
}
