"use client";

import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useRealtime } from "@/hooks/use-realtime";
import RenderItems from "./dnd/render-items";
import { useCards } from "@/stores/zustands/use-cards";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { List } from "@prisma/client";

interface CardListProps {
    members: MemberInterface[];
    list: List
}

const CardList = ({ members, list }: CardListProps) => {
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id ?? null
    const cardsByList = useCards(state => state.cardsByList)
    const cards = cardsByList[list.id] || []

    const realtimeCards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}:list:${list.id}` : null,
        entity: "card",
        initialData: cards
    })

    const { active } = useDndContext()
    const activeCardListId = active?.data.current?.card?.listId

    const { isOver, setNodeRef } = useDroppable({
        id: `list:${list.id}`,
        disabled: activeCardListId === list.id,
        data: {
            type: "list",
            listId: list.id
        }
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col gap-2 p-1 min-h-12.5 rounded-md transition-colors ${isOver ? "bg-primary/5 border border-dashed border-primary/20" : ""
                }`}
        >
            {realtimeCards.length ?
                <RenderItems
                    members={members}
                    listColor={list.color}
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