"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, CalendarIcon, Eye } from "lucide-react";
import { useState } from "react";
import { CardWithAssignees } from "@/actions/cards/details.action";
import CardForm from "../../cards/card-forms/card-form";

interface SortableRowProps {
    card: CardWithAssignees;
    listColor: string;
    members: MemberInterface[];
}

export const SortableRow = ({ card, listColor, members }: SortableRowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: card.id,
        data: {
            type: "card",
            card
        }
    })

    const [open, setOpen] = useState(false)
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition
                }}
                className="flex items-center justify-between p-3 border border-border/50 hover:border-primary/30 rounded-lg bg-background hover:bg-muted/10 transition-all gap-4 group"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                        <GripVertical size={14} />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-background shadow-sm"
                            style={{
                                backgroundColor: listColor
                            }}
                        />
                        <span className="font-medium text-sm truncate">{card.title}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center -space-x-1.5">
                        {card.assignees?.map(assign =>
                            <div
                                key={assign.user.id}
                                className="grid place-items-center w-5 h-5 rounded-full ring-2 ring-background bg-muted border border-border"
                            >
                                <span className="text-[9px] font-semibold text-foreground uppercase">
                                    {assign.user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                    {card.dueDate &&
                        <div className={isOverdue ? "text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded text-xs" : "text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs"}>
                            <CalendarIcon size={12} />
                            <span className="text-[10px] font-medium">{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    }
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="cursor-pointer p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                        <Eye size={14} />
                    </button>
                </div>
            </div>
            <CardForm
                isOpen={open}
                onClose={() => setOpen(false)}
                listId={card.listId}
                initialData={{
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    dueDate: card.dueDate,
                    position: card.position
                }}
                members={members}
                initialAssignedIds={card.assignees.map(assignee => assignee.user.id)}
            />
        </>
    )
}
