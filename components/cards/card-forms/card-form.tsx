"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import React from "react";
import { createCard, updateCard, deleteCard } from "@/actions/cards/card.action";
import { getCardComments, getCardAttachments, getCardBlocks, getCardAssignees, getCardLabels } from "@/actions/cards/details.action";
import { getWorkspaceMembers } from "@/actions/workspaces/member.action";
import { getWorkspaceLabels } from "@/actions/labels/label.action";
import { useActionState } from "react";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Attachment, Block, Label as LabelType } from "@prisma/client";
import { CommentWithAuthor } from "@/actions/cards/details.action";
import AssigneesSection from "./assignees-section";
import LabelsSection from "./labels-section";
import CommentsSection from "./comments-section";
import AttachmentsSection from "./attachements-section";
import BlocksSection from "./blocks-section";
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
    const [deleting, setDeleting] = React.useState(false);

    const [title, setTitle] = React.useState(initialData?.title ?? "");
    const [description, setDescription] = React.useState(initialData?.description ?? "");
    const [dueDate, setDueDate] = React.useState(
        initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : ""
    )

    const [members, setMembers] = React.useState<{ id: string; name: string; avatarUrl: string | null }[]>([]);
    const [labels, setLabels] = React.useState<LabelType[]>([]);
    const [assignedIds, setAssignedIds] = React.useState<string[]>([]);
    const [labelIds, setLabelIds] = React.useState<string[]>([]);
    const [comments, setComments] = React.useState<CommentWithAuthor[]>([]);
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);
    const [blocks, setBlocks] = React.useState<Block[]>([]);

    React.useEffect(() => {
        if (state?.success) onClose();
    }, [state])

    React.useEffect(() => {
        if (!isOpen || !workspace?.id) return;
        setTitle(initialData?.title ?? "");
        setDescription(initialData?.description ?? "");
        setDueDate(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "")
        getWorkspaceMembers(workspace.id).then(ms => setMembers(ms));
        getWorkspaceLabels(workspace.id).then(setLabels);
        if (!initialData?.id) return;
        getCardAssignees(initialData.id).then(a => setAssignedIds(a.map(a => a.userId)));
        getCardLabels(initialData.id).then(l => setLabelIds(l.map(l => l.labelId)));
        getCardComments(initialData.id).then(setComments);
        getCardAttachments(initialData.id).then(setAttachments);
        getCardBlocks(initialData.id).then(setBlocks);
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
                    <Separator />
                    <AssigneesSection
                        cardId={initialData?.id}
                        members={members}
                        assignedIds={assignedIds}
                        onChange={setAssignedIds}
                    />
                    <LabelsSection
                        cardId={initialData?.id}
                        labels={labels}
                        selectedIds={labelIds}
                        onChange={setLabelIds}
                    />
                    {isEdit &&
                        <>
                            <Separator />
                            <CommentsSection cardId={initialData.id} initialComments={comments} />
                            <Separator />
                            <AttachmentsSection attachments={attachments} />
                            <Separator />
                            <BlocksSection blocks={blocks} />
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