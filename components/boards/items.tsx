"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import NewBoard from "./new-board";
import RenderItems from "../drag&drop/renderItems";
import { OrderItem } from "../drag&drop/orderItems";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import CardLoading from "../cards/card-loading";
import CardNotFound from "../cards/card-not-found";
import { useRealtime } from "@/hooks/use-realtime";
import { setBoardPositions } from "@/actions/boards/board.action";
import { useBoards } from "@/stores/zustands/use-boards";
import { Board as BoardPrisma } from "@prisma/client";

const Board = () => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;

    const { boards, setBoards } = useBoards(state => state);
    const [loading, setLoading] = useState(true);
    const [onNewBoard, setOnNewBoard] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const fetchBoards = useCallback(async () => {
        if (!workspaceId) return;

        try {
            const response = await fetch(
                `/api/protected/boards?workspaceId=${workspaceId}`
            )

            const data = await response.json();
            setBoards(data);
        } finally {
            setLoading(false);
        }
    }, [workspaceId])

    useEffect(() => {
        if (!workspaceId) return;

        setLoading(true);
        setBoards([]);
        fetchBoards();

    }, [workspaceId, fetchBoards]);

    const realtimeBoards = useRealtime<"board">({
        room: workspaceId ? `workspace:${workspaceId}` : null,
        entity: "board",
        initialData: boards
    })

    const initialItems = realtimeBoards.map((board) => ({
        id: board.id,
        orderId: board.id,
        name: board.title,
        link: `/dashboard/boards/${board.id}`
    }))

    const handleReorder = async (items: OrderItem[]) => {
        if (!workspaceId) return;
        const boardsOredered = items.map(item => {
            const board = realtimeBoards.find(board => board.id === item.orderId);
            return board;
        }) as BoardPrisma[];

        setBoards(boardsOredered);
        const boards = await setBoardPositions(workspaceId, items.map(item => String(item.orderId)));
        setBoards(boards);
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