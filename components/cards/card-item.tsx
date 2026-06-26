"use client";

import { Card } from "@prisma/client";
import { CalendarIcon, Eye, GripVertical } from "lucide-react";
import { useState } from "react";
import CardForm from "./card-forms/card-form";

interface CardItemProps {
    card: Card
}

const CardItem = ({ card }: CardItemProps) => {
    const [open, setOpen] = useState(false);
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <>
            <div className="flex justify-between items-center gap-5 w-full">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <div className="text-muted-foreground shrink-0 cursor-grab">
                        <GripVertical size={14} />
                    </div>
                    <p className="text-xs truncate">{card.title}</p>
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
            />
        </>
    )
}

export default CardItem;