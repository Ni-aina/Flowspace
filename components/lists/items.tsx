"use client";

import { useRealtime } from "@/hooks/use-realtime";
import { List } from "@prisma/client";
import { OrderItem, OrderItemList } from "@/components/lists/drag&drop/orderItems";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect, useState } from "react";
import { setListPositions } from "@/actions/lists/list.action";
import ListCard from "./card";
import { LayoutList } from "lucide-react";

interface ListItemsProps {
    lists: List[];
}

const ListItems = ({ lists }: ListItemsProps) => {

    const [listsState, setListsState] = useState<List[]>(lists);

    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id;

    const realtimeLists = useRealtime<"list">({
        room: "lists",
        entity: "list",
        initialData: listsState
    })

    const handleReorder = async (items: OrderItem[]) => {
        if (!workspaceId) return;
        const listsOredered = items.map(item => {
            const list = realtimeLists.find(list => list.id === item.list.id);
            return list;
        }) as List[];

        setListsState(listsOredered);
        const lists = await setListPositions(workspaceId, items.map(item => String(item.list.id)));
        setListsState(lists);
    }

    useEffect(() => {
        if (!lists?.length) return;
        setListsState(lists);
    }, [lists?.length])

    return (
        <div className="flex flex-wrap items-center gap-5">
            {
                realtimeLists.length === 0 ?
                    <div className="flex flex-col w-full py-16 lg:py-32 items-center justify-center gap-2">
                        <p className="text-md font-medium">No lists yet</p>
                        <p className="text-sm text-muted-foreground">
                            Create a list to start organizing your cards
                        </p>
                    </div>
                    :
                    <OrderItemList
                        items={realtimeLists.map(list => ({ list }))}
                        onChange={handleReorder}
                        renderItem={(item, dragHandleProps) => (
                            <ListCard list={item.list} dragHandleProps={dragHandleProps} />
                        )}
                    />
            }
        </div>
    )
}

export default ListItems;