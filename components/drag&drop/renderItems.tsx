"use client";

import { useEffect, useState } from "react";
import { OrderItem, OrderItemList } from "./orderItems";
import Link from "next/link";
import { GripVertical } from "lucide-react";

interface RenderItemsProps {
    initialItems: OrderItem[];
}

const RenderItems = ({ initialItems }: RenderItemsProps) => {
    const [items, setItems] = useState<OrderItem[]>(initialItems);

    useEffect(() => {
        setItems(initialItems)
    }, [initialItems])

    return (
        <OrderItemList
            items={items}
            onChange={setItems}
            renderItem={(item, dragHandleProps) =>
                <div className="flex w-full items-center gap-2 hover:bg-primary/5 rounded-sm px-2 py-1">
                    <button
                        type="button"
                        {...dragHandleProps}
                        className="cursor-grab p-1"
                    >
                        <GripVertical size={16} className="text-gray-400" />
                    </button>
                    <Link
                        href={`/dashboard/${item.id}`}
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