"use client";

import {
    horizontalListSortingStrategy,
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List } from "@prisma/client";
import { HTMLAttributes, ReactNode } from "react";

export interface OrderItem {
    list: List
}

interface SortableItemProps {
    item: OrderItem;
    renderItem: (item: OrderItem, dragHandleProps: HTMLAttributes<HTMLElement>) => ReactNode;
}

const SortableItem = ({ item, renderItem }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.list.id,
        data: {
            type: "list",
            listId: item.list.id
        }
    })

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
    renderItem: (item: OrderItem, dragHandleProps: HTMLAttributes<HTMLElement>) => ReactNode;
}

export const OrderItemList = ({ items, renderItem }: OrderItemListProps) => {
    return (
        <SortableContext
            items={items.map(i => i.list.id)}
            strategy={horizontalListSortingStrategy}
        >
            {items.map(item =>
                <SortableItem
                    key={item.list.id}
                    item={item}
                    renderItem={renderItem}
                />
            )}
        </SortableContext>
    )
}
