import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect, useState } from "react";
import { Card } from "@prisma/client";
import { getCardsByListId, moveCard, setCardPositions } from "@/actions/cards/card.action";
import { useRealtime } from "@/hooks/use-realtime";
import RenderItems from "./dnd/renderItems";
import { OrderItem } from "./dnd/orderItems";
import Droppable from "../dnd-native/droppable";

const CardList = ({ listId }: { listId: string }) => {
    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id ?? null;

    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    const realtimeCards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}:list:${listId}` : null,
        entity: "card",
        initialData: cards
    })

    const handleReorder = async (items: OrderItem[]) => {
        if (!workspaceId || !listId) return;
        const cardsOredered = items.map(item => {
            const card = realtimeCards.find(card => card.id === item.card.id);
            return card;
        }) as Card[];

        setCards(cardsOredered);
        const cards = await setCardPositions(workspaceId, listId, items.map(item => String(item.card.id)));
        setCards(cards);
    }

    const onDropItem = async (data: string) => {
        const { card } = JSON.parse(data);
        if (!card || !card.id || card.listId === listId) return;
        await moveCard(card.id, listId)
    }

    useEffect(() => {
        getCardsByListId(listId).then(cards => {
            setCards(cards);
            setLoading(false);
        })
    }, [listId])

    if (loading) return (
        <div className="flex flex-col gap-2 p-1">
            {Array.from({ length: 2 }).map((_, i) =>
                <div key={i} className="h-8 rounded-md bg-muted animate-pulse" />
            )}
        </div>
    )

    if (realtimeCards.length === 0) return null;

    return (
        <Droppable
            id={`list:${listId}`}
            accepts="card"
            onDropItem={onDropItem}
            className="flex flex-col gap-2 p-1"
            activeClassName="bg-primary/5"
        >
            <RenderItems
                initialItems={realtimeCards.map(card => ({ card }))}
                handleReorder={handleReorder}
            />
        </Droppable>
    )
}

export default CardList;