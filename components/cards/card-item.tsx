import { Card } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import CardForm from "./card-forms/card-form";

const CardItem = ({ card }: { card: Card }) => {
    const [open, setOpen] = useState(false);
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <>
            <div onClick={() => setOpen(true)}>
                <p className="text-xs leading-snug">{card.title}</p>
                {card.dueDate &&
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
        </>
    )
}

export default CardItem;