"use client";

import { useRealtime } from "@/hooks/use-realtime";
import { List } from "@prisma/client";
import { OrderItemList } from "@/components/lists/dnd/orderItems";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect, useState } from "react";
import { setListPositions } from "@/actions/lists/list.action";
import ListCard from "./card";
import { useCards } from "@/stores/zustands/use-cards";
import { moveCard, setCardPositions } from "@/actions/cards/card.action";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from "@dnd-kit/core";
import {
    sortableKeyboardCoordinates,
    arrayMove
} from "@dnd-kit/sortable";

interface ListItemsProps {
    lists: List[]
}

const ListItems = ({ lists }: ListItemsProps) => {
    const [listsState, setListsState] = useState<List[]>(lists)
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id
    const { cardsByList, setCardsForList } = useCards()
    const [originalListId, setOriginalListId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const realtimeLists = useRealtime<"list">({
        room: workspaceId ? `workspace:${workspaceId}:list` : null,
        entity: "list",
        initialData: listsState
    })

    useEffect(() => {
        if (!lists?.length) return
        setListsState(lists)
    }, [lists?.length])

    const findContainer = (id: string) => {
        if (String(id).startsWith("list:")) {
            return String(id).replace("list:", "")
        }
        if (listsState.some(list => list.id === id)) {
            return id
        }
        for (const listId in cardsByList) {
            if (cardsByList[listId]?.some(card => card.id === id)) {
                return listId
            }
        }
        return null
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        if (active.data.current?.type === "card") {
            setOriginalListId(active.data.current?.card?.listId || null)
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over || !workspaceId) return

        const activeId = String(active.id)
        const overId = String(over.id)

        if (active.data.current?.type !== "card") return

        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        const activeCards = [...(cardsByList[activeContainer] || [])]
        const overCards = [...(cardsByList[overContainer] || [])]
        const activeIndex = activeCards.findIndex(c => c.id === activeId)
        const overIndex = overCards.findIndex(c => c.id === overId)

        let newIndex = overCards.length
        if (overIndex !== -1) {
            newIndex = overIndex
        }

        const [draggedCard] = activeCards.splice(activeIndex, 1)
        if (draggedCard) {
            draggedCard.listId = overContainer
            overCards.splice(newIndex, 0, draggedCard)

            useCards.setState(state => ({
                cardsByList: {
                    ...state.cardsByList,
                    [activeContainer]: activeCards,
                    [overContainer]: overCards
                }
            }))
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setOriginalListId(null)

        if (!over || !workspaceId) return

        if (active.data.current?.type === "list") {
            if (active.id === over.id) return
            const oldIndex = realtimeLists.findIndex(l => l.id === active.id)
            const newIndex = realtimeLists.findIndex(l => l.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
                const newLists = arrayMove(realtimeLists, oldIndex, newIndex)
                setListsState(newLists)
                const updated = await setListPositions(workspaceId, newLists.map(l => l.id))
                setListsState(updated)
            }
            return
        }

        if (active.data.current?.type === "card") {
            const activeId = String(active.id)
            const overId = String(over.id)
            const overContainer = findContainer(overId)

            if (overContainer && originalListId) {
                if (originalListId === overContainer) {
                    const activeCards = [...(cardsByList[overContainer] || [])]
                    const activeIndex = activeCards.findIndex(c => c.id === activeId)
                    const overIndex = activeCards.findIndex(c => c.id === overId)

                    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                        const newCards = arrayMove(activeCards, activeIndex, overIndex)
                        setCardsForList(overContainer, newCards)
                        await setCardPositions(workspaceId, overContainer, newCards.map(c => c.id))
                    }
                } else {
                    await moveCard(activeId, overContainer)
                    const sourceCards = cardsByList[originalListId] || []
                    const destCards = cardsByList[overContainer] || []
                    await Promise.all([
                        setCardPositions(workspaceId, originalListId, sourceCards.map(c => c.id)),
                        setCardPositions(workspaceId, overContainer, destCards.map(c => c.id))
                    ])
                }
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col sm:flex-row gap-5">
                {realtimeLists.length === 0 ?
                    <div className="flex flex-col w-full py-16 lg:py-32 items-center justify-center gap-2">
                        <p className="text-md font-medium">No lists yet</p>
                        <p className="text-sm text-muted-foreground">
                            Create a list to start organizing your cards
                        </p>
                    </div>
                    :
                    <OrderItemList
                        items={realtimeLists.map(list => ({ list }))}
                        renderItem={(item, dragHandleProps) =>
                            <ListCard list={item.list} dragHandleProps={dragHandleProps} />
                        }
                    />
                }
            </div>
        </DndContext>
    )
}

export default ListItems