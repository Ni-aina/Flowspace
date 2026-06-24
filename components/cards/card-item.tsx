import { Card, List } from "@prisma/client";
import { CalendarIcon, GripVertical } from "lucide-react";
import { useState } from "react";
import CardForm from "./card-forms/card-form";
import Draggable from "../dnd-native/draggable";

interface CardItemProps {
    card: Card
}

const CardItem = ({ card }: CardItemProps) => {
    const [open, setOpen] = useState(false);
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <Draggable
            id={JSON.stringify({ card })}
            type="card"
        >
            <div onClick={() => setOpen(true)} className="flex justify-between items-center gap-5">
                <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-muted-foreground" />
                    <p className="text-xs truncate">{card.title}</p>
                </div>
                {
                    card.dueDate &&
                    <div className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                        <CalendarIcon size={10} />
                        <span className="text-[10px]">{new Date(card.dueDate).toLocaleDateString()}</span>
                    </div>
                }
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
        </Draggable>
    )
}

export default CardItem;