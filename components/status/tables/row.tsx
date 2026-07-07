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
            <tr
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition
                }}
                className="border-b border-border hover:bg-muted/20 transition-colors"
            >
                <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab text-muted-foreground"
                        >
                            <GripVertical size={14} />
                        </div>
                        <span className="font-medium text-xs">{card.title}</span>
                    </div>
                </td>
                <td className="py-2 px-4">
                    <div className="flex items-center">
                        {card.assignees?.map(assign =>
                            <div
                                key={assign.user.id}
                                className="grid place-items-center w-4 h-4 rounded-full"
                                style={{
                                    backgroundColor: listColor
                                }}
                            >
                                <span className="text-white text-[8px] font-bold leading-none">
                                    {assign.user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="py-2 px-4">
                    {card.dueDate &&
                        <div className={isOverdue ? "text-red-500 flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                            <CalendarIcon size={10} />
                            <span className="text-[10px]">{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    }
                </td>
                <td className="py-2 px-4 text-right">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="cursor-pointer text-muted-foreground hover:scale-105 transition-transform"
                    >
                        <Eye size={14} />
                    </button>
                </td>
            </tr>
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
