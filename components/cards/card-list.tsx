import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Card } from "@prisma/client";
import { moveCard, setCardPositions } from "@/actions/cards/card.action";
import { useRealtime } from "@/hooks/use-realtime";
import RenderItems from "./dnd/renderItems";
import { OrderItem } from "./dnd/orderItems";
import Droppable from "../dnd-native/droppable";
import { useCards } from "@/stores/zustands/use-cards";

const CardList = ({ listId }: { listId: string }) => {
    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id ?? null;

    const {
        cardsByList,
        setCardsForList,
        addCard,
        removeCard
    } = useCards(state => state);
    const cards = cardsByList[listId] || [];

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
        setCardsForList(listId, cardsOredered);
        const cards = await setCardPositions(workspaceId, listId, items.map(item => String(item.card.id)));
        setCardsForList(listId, cards);
    }

    const onDropItem = async (data: string) => {
        const { card } = JSON.parse(data);
        if (!card || !card.id || card.listId === listId) return;
        removeCard(card.listId, card.id);
        addCard(listId, card);
        await moveCard(card.id, listId);
    }

    return (
        <Droppable
            id={`list:${listId}`}
            accepts="card"
            onDropItem={onDropItem}
            className="flex flex-col gap-2 p-1"
            activeClassName="bg-primary/5"
        >
            {
                realtimeCards.length ?
                    <RenderItems
                        initialItems={realtimeCards.map(card => ({ card }))}
                        handleReorder={handleReorder}
                    />
                    :
                    <div className="text-center text-xs py-2">
                        Create or drop a card here
                    </div>
            }
        </Droppable>
    )
}

export default CardList;