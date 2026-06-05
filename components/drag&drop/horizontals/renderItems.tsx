"use client";

import { useOptimistic, useTransition } from "react";
import { OrderItem, OrderItemList } from "./orderItems";
import { usePathname } from "next/navigation";
import { LayoutGrid, List, Table } from "lucide-react";
import Link from "next/link";

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
                        rounded-full px-3 py-1
                        ${lastPath === item.id ? 'bg-primary/5' : ''}`
                    }
                >
                    <div
                        className="flex items-center gap-2 cursor-grab"
                        {...dragHandleProps}
                    >
                        {
                            item.type === "grid" &&
                            <LayoutGrid size={16} className="text-gray-400" />
                        }
                        {
                            item.type === "table" &&
                            <Table size={16} className="text-gray-400" />
                        }
                        {
                            item.type === "list" &&
                            <List size={16} className="text-gray-400" />
                        }
                    </div>
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