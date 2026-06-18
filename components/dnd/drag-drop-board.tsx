import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useState } from "react";
import DraggableItem from "./draggable-item";
import DroppableBlock from "./droppable-block";

interface Item {
    id: string;
    label: string;
}

interface BlockMap {
    [blockId: string]: Item[];
}

const initialBlocks: BlockMap = {
    blockA: [
        { id: "item-1", label: "Item 1" },
        { id: "item-2", label: "Item 2" }
    ],
    blockB: [
        { id: "item-3", label: "Item 3" }
    ],
    blockC: []
}

const DragDropBoard = () => {

    const [blocks, setBlocks] = useState<BlockMap>(initialBlocks);

    const findBlockByItemId = (itemId: string) =>
        Object.keys(blocks).find((blockId) =>
            blocks[blockId].some((item) => item.id === itemId)
        )

    const handleDragEnd = (event: DragEndEvent) => {

        const { active, over } = event;

        if (!over) return;

        const sourceBlockId = findBlockByItemId(active.id as string);
        const targetBlockId = over.id as string;

        if (!sourceBlockId || sourceBlockId === targetBlockId) return;

        setBlocks((prev) => {

            const sourceItems = [...prev[sourceBlockId]];
            const targetItems = [...prev[targetBlockId]];
            const itemIndex = sourceItems.findIndex((i) => i.id === active.id);
            const [moved] = sourceItems.splice(itemIndex, 1);
            targetItems.push(moved);

            return {
                ...prev,
                [sourceBlockId]: sourceItems,
                [targetBlockId]: targetItems,
            }
        })
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", gap: 16 }}>
                {Object.entries(blocks).map(([blockId, items]) =>
                    <DroppableBlock key={blockId} id={blockId} style={{ minHeight: 100, padding: 8, background: "#f0f0f0" }}>
                        {items.map((item) =>
                            <DraggableItem key={item.id} id={item.id}>
                                <div style={{ padding: "8px 12px", background: "#fff", marginBottom: 8 }}>
                                    {item.label}
                                </div>
                            </DraggableItem>
                        )}
                    </DroppableBlock>
                )}
            </div>
        </DndContext>
    )
}

export default DragDropBoard;