"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createCard, updateCard, deleteCard } from "@/actions/cards/card.action";
import { getCardComments, getCardAttachments, getCardAssignees } from "@/actions/cards/details.action";
import { getWorkspaceMembers } from "@/actions/workspaces/member.action";
import { useActionState } from "react";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Attachment } from "@prisma/client";
import { CommentWithAuthor } from "@/actions/cards/details.action";
import AssigneesSection from "./assignees-section";
import CommentsSection from "./comments-section";
import AttachmentsSection from "./attachements-section";
import CardFields from "./card-fields";

interface CardFormProps {
    isOpen: boolean;
    onClose: () => void;
    listId: string;
    initialData?: {
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        position: number;
    }
}

const CardForm = ({ isOpen, onClose, listId, initialData }: CardFormProps) => {
    const isEdit = !!initialData;
    const { workspace } = useWorkspace();

    const [state, formAction, pending] = useActionState(isEdit ? updateCard : createCard, null);
    const [deleting, setDeleting] = useState(false);

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [dueDate, setDueDate] = useState(
        initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : ""
    )

    const [members, setMembers] = useState<{ id: string; name: string; avatarUrl: string | null }[]>([]);
    const [assignedIds, setAssignedIds] = useState<string[]>([]);
    const [comments, setComments] = useState<CommentWithAuthor[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state])

    useEffect(() => {
        if (!isOpen || !workspace?.id) return;
        setTitle(initialData?.title ?? "");
        setDescription(initialData?.description ?? "");
        setDueDate(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "")
        getWorkspaceMembers(workspace.id).then(ms => setMembers(ms));
        if (!initialData?.id) return;
        getCardAssignees(initialData.id).then(a => setAssignedIds(a.map(a => a.userId)));
        getCardComments(initialData.id).then(setComments);
        getCardAttachments(initialData.id).then(setAttachments);
    }, [isOpen])

    const handleDelete = async () => {
        if (!initialData?.id) return;
        setDeleting(true);
        await deleteCard(initialData.id);
        setDeleting(false);
        onClose();
    }

    return (
        <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle>{isEdit ? "Edit Card" : "New Card"}</SheetTitle>
                    </div>
                </SheetHeader>
                <form action={formAction} className="flex flex-col gap-5 px-5">
                    {isEdit && <input type="hidden" name="cardId" value={initialData.id} />}
                    {isEdit && <input type="hidden" name="position" value={initialData.position} />}
                    {!isEdit && <input type="hidden" name="listId" value={listId} />}
                    <CardFields
                        initialTitle={title}
                        initialDescription={description}
                        initialDueDate={dueDate}
                    />
                    {isEdit &&
                        <>
                            <AssigneesSection
                                cardId={initialData?.id}
                                members={members}
                                assignedIds={assignedIds}
                                onChange={setAssignedIds}
                            />
                            <CommentsSection cardId={initialData.id} initialComments={comments} />
                            <AttachmentsSection attachments={attachments} />
                            <Separator />
                        </>
                    }
                    {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
                    <div className={`flex ${isEdit ? "justify-between" : "justify-end"} gap-2 mt-2 mb-4`}>
                        {isEdit &&
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={13} />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        }
                        <div className="flex justify-end items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={pending}
                                className="px-2 py-1 rounded-md border border-input cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={pending}
                                className="px-2 py-1 rounded-md bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {pending ? "Saving..." : isEdit ? "Save changes" : "Create card"}
                            </button>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default CardForm;