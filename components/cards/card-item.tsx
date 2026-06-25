import { Card, List } from "@prisma/client";
import { CalendarIcon, Eye, GripVertical } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import CardForm from "./card-forms/card-form";
import Draggable from "../dnd-native/draggable";

interface CardItemProps {
    card: Card
    dragHandleProps: HTMLAttributes<HTMLElement>
}

const CardItem = ({ card, dragHandleProps }: CardItemProps) => {
    const [open, setOpen] = useState(false);
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <>
            <div className="flex justify-between items-center gap-5">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        {...dragHandleProps}
                        className="cursor-grab text-muted-foreground"
                    >
                        <GripVertical size={14} />
                    </button>
                    <Draggable
                        id={JSON.stringify({ card })}
                        type="card"
                        className="cursor-grabbing"
                    >
                        <p className="text-xs truncate">{card.title}</p>
                    </Draggable>
                </div>
                <div className="flex items-center gap-2">
                    {
                        card.dueDate &&
                        <div className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                            <CalendarIcon size={10} />
                            <span className="text-[10px]">{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    }
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
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