"use client";

import { useOptimistic, useTransition } from "react";
import { OrderItem, OrderItemList } from "./order-items";
import { usePathname } from "next/navigation";
import BoardCard from "../card";

interface RenderItemsProps {
    initialItems: OrderItem[];
    handleReorder: (items: OrderItem[]) => Promise<void>;
    direction: "horizontal" | "vertical";
}

const RenderItems = ({
    initialItems,
    handleReorder,
    direction
}: RenderItemsProps) => {
    const pathname = usePathname();
    const lastPath = pathname.split('/').pop();

    const [isPending, startTransition] = useTransition()
    const [items, setItems] = useOptimistic<OrderItem[], OrderItem[]>(
        initialItems,
        (_state, newItems) => newItems
    )

    const handleChange = (newItems: OrderItem[]) => {
        if (isPending) return;
        startTransition(async () => {
            setItems(newItems)
            await handleReorder(newItems)
        })
    }

    return (
        <OrderItemList
            items={items}
            onChange={handleChange}
            renderItem={(item, dragHandleProps) =>
                <BoardCard
                    item={item}
                    isActive={lastPath === item.id}
                    dragHandleProps={dragHandleProps}
                />
            }
            direction={direction}
        />
    )
}

export default RenderItems;