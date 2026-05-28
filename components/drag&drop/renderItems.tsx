"use client";

import { useOptimistic, useTransition } from "react";
import { OrderItem, OrderItemList } from "./orderItems";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { usePathname } from "next/navigation";

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
                    className={`flex w-full items-center gap-2 hover:bg-primary/5 rounded-sm px-2 py-1
                    ${lastPath === item.id ? 'bg-primary/5' : ''}`}
                >
                    <button
                        type="button"
                        {...dragHandleProps}
                        className="cursor-grab p-1"
                    >
                        <GripVertical size={16} className="text-gray-400" />
                    </button>
                    <Link
                        href={item.link}
                        className="truncate flex-1 min-w-0"
                    >
                        {item.name}
                    </Link>
                </div>
            }
        />
    )
}

export default RenderItems;