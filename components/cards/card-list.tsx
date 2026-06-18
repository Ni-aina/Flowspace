import { useWorkspace } from "@/stores/zustands/use-workspace";
import CardItem from "./card-item";
import { useEffect, useState } from "react";
import { Card } from "@prisma/client";
import { getCardsByListId } from "@/actions/cards/card.action";
import { useRealtime } from "@/hooks/use-realtime";
import DraggableItem from "@/components/lists/dnd/draggable-item";

const CardList = ({ listId }: { listId: string }) => {

    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id ?? null;

    const [initialCards, setInitialCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCardsByListId(listId).then(cards => {
            setInitialCards(cards);
            setLoading(false);
        })
    }, [listId])

    const cards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}` : null,
        entity: "card",
        initialData: initialCards
    })

    if (loading) return (
        <div className="flex flex-col gap-2 p-1">
            {Array.from({ length: 2 }).map((_, i) =>
                <div key={i} className="h-8 rounded-md bg-muted animate-pulse" />
            )}
        </div>
    )

    if (cards.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 p-1">
            {cards.map(card =>
                <DraggableItem key={card.id} id={card.id}>
                    <CardItem card={card} />
                </DraggableItem>
            )}
        </div>
    )
}

export default CardList;