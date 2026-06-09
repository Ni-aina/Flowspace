"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import BoardForm from "./board-form";
import RenderItems from "./drag&drop/renderItems";
import { OrderItem } from "./drag&drop/orderItems";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import CardLoading from "../cards/card-loading";
import CardNotFound from "../cards/card-not-found";
import { useRealtime } from "@/hooks/use-realtime";
import { setBoardPositions } from "@/actions/boards/board.action";
import { useBoards, useLoadingBoards } from "@/stores/zustands/use-boards";
import { Board } from "@prisma/client";

const BoardItems = () => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;

    const { boards, setBoards } = useBoards(state => state);
    const { loading } = useLoadingBoards();
    const [onNewBoard, setOnNewBoard] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const realtimeBoards = useRealtime<"board">({
        room: workspaceId ? `workspace:${workspaceId}` : null,
        entity: "board",
        initialData: boards
    })

    const initialItems = realtimeBoards.map((board) => ({
        id: board.id,
        name: board.title,
        type: board.type,
        link: `/dashboard/boards/${board.id}`
    }))

    const handleReorder = async (items: OrderItem[]) => {
        if (!workspaceId) return;
        const boardsOredered = items.map(item => {
            const board = realtimeBoards.find(board => board.id === item.id);
            return board;
        }) as Board[];

        setBoards(boardsOredered);
        const boards = await setBoardPositions(workspaceId, items.map(item => String(item.id)));
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
                    initialItems.length === 0 &&
                    <div className="my-3">
                        <CardNotFound
                            title="Boards"
                            description="No boards found"
                        />
                    </div>
            }
            <RenderItems
                initialItems={initialItems}
                handleReorder={handleReorder}
                direction="vertical"
            />
            <BoardForm
                isOpen={onNewBoard}
                setOpen={setOnNewBoard}
            />
        </div>
    )
}

export default BoardItems;