"use client";

import { useEffect, useState } from "react";
import { Board as BoardType } from "@prisma/client";
import { Plus } from "lucide-react";
import NewBoard from "./new-board";
import RenderItems from "../drag&drop/renderItems";
import { OrderItem } from "../drag&drop/orderItems";
import { setBoardPosition } from "@/actions/workspaces/board.action";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import CardLoading from "../cards/card-loading";
import CardNotFound from "../cards/card-not-found";

const Board = () => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;

    const [loading, setLoading] = useState(true);
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [onNewBoard, setOnNewBoard] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const initialItems = boards.map((board) => ({
        id: board.id,
        orderId: board.id,
        name: board.title,
        link: "#"
    }))

    const fetchBoards = async () => {
        try {
            const response = await fetch(`/api/boards?workspaceId=${workspaceId}`);
            const data = await response.json();
            setBoards(data);
        } catch {
            
        } finally {
            setLoading(false)
        }
    }

    const handleReorder = async (items: OrderItem[]) => {
        await Promise.all(items.map((board, position) =>
            setBoardPosition(String(board.orderId), position)
        ))
        await fetchBoards();
    }

    useEffect(() => {
        if (!workspaceId) return;

        (async () => {
            setLoading(true);
            await fetchBoards();
        })()

    }, [workspaceId])

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