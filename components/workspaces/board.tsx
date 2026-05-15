"use client";

import { useEffect, useState } from "react";
import { Board as BoardType } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import NewBoard from "./new-board";
import ItemLoading from "../itemLoading";
import RenderItems from "../drag&drop/renderItems";
import { OrderItem } from "../drag&drop/orderItems";
import { setBoardPosition } from "@/actions/workspaces/board.action";

const Board = () => {
    const [loading, setLoading] = useState(true);
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [onNewBoard, setOnNewBoard] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const initialItems = boards.map((board) => ({
        id: board.id,
        orderId: board.id,
        name: board.title
    }))

    const handleReorder = async (items: OrderItem[]) => {
        await Promise.all(items.map((board, position) =>
            setBoardPosition(String(board.orderId), position)
        ))
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/boards");
                const data = await response.json();
                setBoards(data);
            } catch {

            } finally {
                setLoading(false)
            }
        })()
    }, [])

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
                    <Loader2
                        size={16}
                        className="animate-spin"
                    />
                    :
                    boards.length === 0 ?
                        <p>No boards found</p>
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