"use client";

import { OrderItem, OrderItemList } from "./order-items";
import { usePathname } from "next/navigation";
import CardItem from "../card-item";

interface RenderItemsProps {
    initialItems: OrderItem[];
}

const RenderItems = ({
    initialItems
}: RenderItemsProps) => {
    const pathname = usePathname();
    const lastPath = pathname.split('/').pop();

    return (
        <OrderItemList
            items={initialItems}
            renderItem={(item, dragHandleProps) =>
                <div
                    {...dragHandleProps}
                    className={`
                        flex flex-col gap-1 p-2 rounded-md border border-input bg-background 
                        hover:border-muted-foreground/30 transition-colors cursor-grab
                        ${lastPath === item.card.id ? 'bg-primary/5' : ''}`
                    }
                >
                    <CardItem
                        card={item.card}
                    />
                </div>
            }
        />
    )
}

export default RenderItems;