import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect, useState } from "react";
import { Card } from "@prisma/client";
import { getCardsByListId, setCardPositions } from "@/actions/cards/card.action";
import { useRealtime } from "@/hooks/use-realtime";
import RenderItems from "./dnd/renderItems";
import { OrderItem } from "./dnd/orderItems";

const CardList = ({ listId }: { listId: string }) => {
    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id ?? null;

    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    const realtimeCards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}` : null,
        entity: "card",
        initialData: cards
    })

    const handleReorder = async (items: OrderItem[]) => {
        if (!workspaceId) return;
        const cardsOredered = items.map(item => {
            const card = realtimeCards.find(card => card.id === item.card.id);
            return card;
        }) as Card[];

        setCards(cardsOredered);
        const cards = await setCardPositions(workspaceId, items.map(item => String(item.card.id)));
        setCards(cards);
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
        <div className="flex flex-col gap-2 p-1">
            <RenderItems
                initialItems={realtimeCards.map(card => ({ card }))}
                handleReorder={handleReorder}
            />
        </div>
    )
}

export default CardList;