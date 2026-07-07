"use client";

import { CalendarIcon, Eye, GripVertical } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import CardForm from "./card-forms/card-form";
import { CardWithAssignees } from "@/actions/cards/details.action";

interface CardItemProps {
    dragHandleProps: HTMLAttributes<HTMLElement>;
    members: MemberInterface[];
    listColor: string
    card: CardWithAssignees
}

const CardItem = ({
    dragHandleProps,
    members,
    listColor,
    card
}: CardItemProps) => {
    const [open, setOpen] = useState(false);
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <>
            <div className="flex justify-between items-center gap-5 w-full">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <div
                        className="text-muted-foreground shrink-0 cursor-grab"
                        {...dragHandleProps}
                    >
                        <GripVertical size={14} />
                    </div>
                    <div className="flex items-center gap-1">
                        <p className="text-xs truncate">{card.title}</p>
                        <div className="flex items-center">
                            {
                                card.assignees?.map(assign =>
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
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {
                        card.dueDate &&
                        <div className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                            <CalendarIcon size={10} />
                            <span className="text-[10px]">{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    }
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                        className="cursor-pointer text-muted-foreground hover:scale-105 transition-transform"
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

export default CardItem;