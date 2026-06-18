"use client";

import { useOptimistic, useTransition } from "react";
import { OrderItem, OrderItemList } from "./orderItems";
import { usePathname } from "next/navigation";
import CardItem from "../card-item";

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
                        flex flex-col gap-1 p-2 rounded-md border border-input bg-background 
                        cursor-grab hover:border-muted-foreground/30 transition-colors
                        ${lastPath === item.card.id ? 'bg-primary/5' : ''}`
                    }
                    {...dragHandleProps}
                >
                    <CardItem card={item.card} />
                </div>
            }
        />
    )
}

export default RenderItems;