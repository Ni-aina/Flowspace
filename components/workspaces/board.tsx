"use client";

import { useCallback, useEffect, useState } from "react";
import type { Board } from "@prisma/client";
import { Plus } from "lucide-react";
import NewBoard from "./new-board";
import RenderItems from "../drag&drop/renderItems";
import { OrderItem } from "../drag&drop/orderItems";
import { setBoardPosition } from "@/actions/workspaces/board.action";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import CardLoading from "../cards/card-loading";
import CardNotFound from "../cards/card-not-found";
import { useRealtime } from "@/hooks/use-realtime";

const Board = () => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;

    const [loading, setLoading] = useState(true);
    const [initialBoards, setInitialBoards] = useState<Board[]>([]);
    const [onNewBoard, setOnNewBoard] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const fetchBoards = useCallback(async () => {
        if (!workspaceId) return;

        try {
            const response = await fetch(
                `/api/boards?workspaceId=${workspaceId}`
            )

            const data = await response.json();
            setInitialBoards(data);
        } finally {
            setLoading(false);
        }
    }, [workspaceId])

    useEffect(() => {
        if (!workspaceId) return;

        setLoading(true);
        fetchBoards();
    }, [workspaceId, fetchBoards]);

    const boards = useRealtime<"board">({
        room: workspaceId ? `workspace:${workspaceId}` : null,
        entity: "board",
        initialData: initialBoards
    })

    const initialItems = boards.map((board) => ({
        id: board.id,
        orderId: board.id,
        name: board.title,
        link: "#"
    }))

    const handleReorder = async (items: OrderItem[]) => {
        await Promise.all(items.map((board, position) =>
            setBoardPosition(String(board.orderId), position)
        ))
    }

    return (
        <div className="px-1 space-y-2">
            <div className="my-2 flex justify-between items-center gap-2">
                <span>Boards</span>
                <button
                    onClick={handleShowBoard}
                    className="cursor-pointer hover:scale-105"
                >
                    <Plus size={16} />
                </button>
            </div>
            {
                loading ?
                    <div className="my-3">
                        <CardLoading />
                    </div>
                    :
                    boards.length === 0 ?
                        <div className="my-3">
                            <CardNotFound
                                title="Boards"
                                description="No boards found"
                            />
                        </div>
                        :
                        <RenderItems
                            initialItems={initialItems}
                            handleReorder={handleReorder}
                        />
            }
            <NewBoard
                onNewBoard={onNewBoard}
                setOnNewBoard={setOnNewBoard}
            />
        </div>
    )
}

export default Board;