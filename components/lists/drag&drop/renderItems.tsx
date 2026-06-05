"use client";

import { useOptimistic, useTransition } from "react";
import { OrderItem, OrderItemList } from "./orderItems";
import { usePathname } from "next/navigation";
import ListCard from "../card";

interface RenderItemsProps {
    initialItems: OrderItem[];
    handleReorder: (items: OrderItem[]) => Promise<void>;
}

const RenderItems = ({
    initialItems,
    handleReorder
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
                <div
                    className={`
                        flex w-full items-center gap-2 hover:bg-primary/5 
                        rounded-full px-3 py-1 cursor-grab
                        ${lastPath === item.list.id ? 'bg-primary/5' : ''}`
                    }
                    {...dragHandleProps}
                >
                    <ListCard
                        list={item.list}
                    />
                </div>
            }
        />
    )
}

export default RenderItems;