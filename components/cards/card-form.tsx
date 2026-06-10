"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Paperclip, MessageSquare, Tag, Users } from "lucide-react";
import React from "react";
import { createCard, updateCard } from "@/actions/cards/card.action";
import { useActionState } from "react";

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

const CardForm = ({
    isOpen,
    onClose,
    listId,
    initialData
}: CardFormProps) => {
    const isEdit = !!initialData;

    const [state, formAction, pending] = useActionState(
        isEdit ? updateCard : createCard,
        null
    )

    const [title, setTitle] = React.useState(initialData?.title ?? "");
    const [description, setDescription] = React.useState(initialData?.description ?? "");
    const [dueDate, setDueDate] = React.useState(
        initialData?.dueDate
            ? new Date(initialData.dueDate).toISOString().slice(0, 16)
            : ""
    )

    React.useEffect(() => {
        if (state?.success) onClose();
    }, [state])

    React.useEffect(() => {
        if (!isOpen) return;
        setTitle(initialData?.title ?? "");
        setDescription(initialData?.description ?? "");
        setDueDate(
            initialData?.dueDate
                ? new Date(initialData.dueDate).toISOString().slice(0, 16)
                : ""
        )
    }, [isOpen])

    return (
        <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <SheetContent side="right" aria-describedby={undefined} className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-4">
                    <SheetTitle>{isEdit ? "Edit Card" : "New Card"}</SheetTitle>
                </SheetHeader>
                <form action={formAction} className="flex flex-col gap-5 px-5">
                    {isEdit && <input type="hidden" name="cardId" value={initialData.id} />}
                    {isEdit && <input type="hidden" name="position" value={initialData.position} />}
                    {!isEdit && <input type="hidden" name="listId" value={listId} />}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Card title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="description">
                            <span className="flex items-center gap-1.5">
                                <MessageSquare size={13} className="text-muted-foreground" />
                                Description
                            </span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Add a description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="dueDate">
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon size={13} className="text-muted-foreground" />
                                Due Date
                            </span>
                        </Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-1.5">
                        <Label>
                            <span className="flex items-center gap-1.5">
                                <Users size={13} className="text-muted-foreground" />
                                Assignees
                            </span>
                        </Label>
                        <p className="text-xs text-muted-foreground">Assignees can be managed after creating the card.</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>
                            <span className="flex items-center gap-1.5">
                                <Tag size={13} className="text-muted-foreground" />
                                Labels
                            </span>
                        </Label>
                        <p className="text-xs text-muted-foreground">Labels can be managed after creating the card.</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>
                            <span className="flex items-center gap-1.5">
                                <Paperclip size={13} className="text-muted-foreground" />
                                Attachments
                            </span>
                        </Label>
                        <p className="text-xs text-muted-foreground">Attachments can be added after creating the card.</p>
                    </div>
                    {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={pending}
                            className="px-2 py-1 rounded-md border border-input cursor-pointer 
                            hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="px-2 py-1 rounded-md bg-primary text-primary-foreground cursor-pointer 
                            hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pending ? "Saving..." : isEdit ? "Save changes" : "Create card"}
                        </button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default CardForm;