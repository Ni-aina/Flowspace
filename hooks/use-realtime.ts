"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { WorkspaceEvent, EntityType, EntityMap } from "@/types/realtime";

type Options<E extends EntityType> = {
    room: string | null;
    entity: E;
    initialData?: EntityMap[E][];
}

export const useRealtime = <E extends EntityType>({
    room,
    entity,
    initialData
}: Options<E>) => {
    const [data, setData] = useState<EntityMap[E][]>([]);
    const prevRoom = useRef<string | null>(null);

    useEffect(() => {
        if (room !== prevRoom.current) {
            prevRoom.current = room;
            setData([]);
        }
    }, [room])

    useEffect(() => {
        if (!prevRoom.current || !initialData) return;
        setData(initialData);
    }, [
        prevRoom.current,
        initialData
    ])

    useEffect(() => {
        if (!room) return;

        socket.connect();
        socket.emit("join-workspace", room);

        const handler = (event: WorkspaceEvent<E>) => {
            if (event.entity !== entity) return;

            setData(prev => {
                switch (event.action) {
                    case "created":
                        return [...prev, event.payload];
                    case "updated":
                        return prev.map(item =>
                            item.id === event.payload.id ? event.payload : item
                        )
                    case "moved":
                        return event.payload as unknown as EntityMap[E][];
                    case "deleted":
                        return prev.filter(item => item.id !== event.payload.id);
                    default:
                        return prev;
                }
            })
        }

        socket.on("workspace:event", handler);

        return () => {
            socket.off("workspace:event", handler);
            socket.emit("leave-workspace", room);
        }
    }, [room, entity]);

    return data;
}