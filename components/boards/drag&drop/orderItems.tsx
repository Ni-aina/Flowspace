import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    UniqueIdentifier
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    arrayMove,
    horizontalListSortingStrategy,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Board } from "@prisma/client";
import { HTMLAttributes, ReactNode } from "react";

export interface OrderItem {
    id: UniqueIdentifier;
    name: string;
    type: Board["type"],
    link: string;
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
    } = useSortable({ id: item.id })

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
    direction: "horizontal" | "vertical";
}

export const OrderItemList = ({ items, onChange, renderItem, direction }: OrderItemListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        onChange(arrayMove(items, oldIndex, newIndex))
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={direction === "horizontal" ? horizontalListSortingStrategy : verticalListSortingStrategy}
            >
                {items.map((item) =>
                    <SortableItem
                        key={item.id}
                        item={item}
                        renderItem={renderItem}
                    />
                )}
            </SortableContext>
        </DndContext>
    )
}