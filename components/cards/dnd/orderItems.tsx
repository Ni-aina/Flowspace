import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    arrayMove,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@prisma/client";
import { HTMLAttributes, ReactNode } from "react";

export interface OrderItem {
    card: Card
}

interface SortableItemProps {
    item: OrderItem;
    renderItem: (item: OrderItem, dragHandleProps: HTMLAttributes<HTMLElement>) => ReactNode;
}

const SortableItem = ({ item, renderItem }: SortableItemProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: item.card.id })

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition
            }}
        >
            {renderItem(item, { ...attributes, ...listeners })}
        </div>
    )
}

interface OrderItemListProps {
    items: OrderItem[];
    onChange: (items: OrderItem[]) => void;
    renderItem: (item: OrderItem, dragHandleProps: HTMLAttributes<HTMLElement>) => ReactNode;
}

export const OrderItemList = ({ items, onChange, renderItem }: OrderItemListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = items.findIndex((i) => i.card.id === active.id)
        const newIndex = items.findIndex((i) => i.card.id === over.id)
        onChange(arrayMove(items, oldIndex, newIndex))
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.card.id)}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item) =>
                    <SortableItem
                        key={item.card.id}
                        item={item}
                        renderItem={renderItem}
                    />
                )}
            </SortableContext>
        </DndContext>
    )
}