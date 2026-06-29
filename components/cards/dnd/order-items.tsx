"use client";

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes, ReactNode } from "react";
import { CardWithAssignees } from "@/actions/cards/details.action";

export interface OrderItem {
    card: CardWithAssignees
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
    } = useSortable({
        id: item.card.id,
        data: {
            type: "card",
            card: item.card
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
    )
}