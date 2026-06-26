"use client";

import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useRealtime } from "@/hooks/use-realtime";
import RenderItems from "./dnd/renderItems";
import { useCards } from "@/stores/zustands/use-cards";
import { useDroppable, useDndContext } from "@dnd-kit/core";

interface CardListProps {
    listId: string
}

const CardList = ({ listId }: CardListProps) => {
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id ?? null
    const cardsByList = useCards(state => state.cardsByList)
    const cards = cardsByList[listId] || []

    const realtimeCards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}:list:${listId}` : null,
        entity: "card",
        initialData: cards
    })

    const { active } = useDndContext()
    const activeCardListId = active?.data.current?.card?.listId

    const { isOver, setNodeRef } = useDroppable({
        id: `list:${listId}`,
        disabled: activeCardListId === listId,
        data: {
            type: "list",
            listId
        }
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col gap-2 p-1 min-h-12.5 rounded-md transition-colors ${
                isOver ? "bg-primary/5 border border-dashed border-primary/20" : ""
            }`}
        >
            {realtimeCards.length ?
                <RenderItems
                    initialItems={realtimeCards.map(card => ({ card }))}
                />
                :
                <div className="text-center text-xs py-4 text-muted-foreground">
                    Create or drop a card here
                </div>
            }
        </div>
    )
}

export default CardList