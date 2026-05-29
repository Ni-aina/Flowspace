"use client";

import { useRealtime } from "@/hooks/use-realtime";
import { useBoards } from "@/stores/zustands/use-boards";
import { redirect } from "next/navigation";
import RenderItems from "../drag&drop/horizontals/renderItems";
import { OrderItem } from "../drag&drop/horizontals/orderItems";
import { setBoardPositions } from "@/actions/boards/board.action";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Board } from "@prisma/client";
import { Filter, Plus, Search } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

interface BoardSpaceProps {
    boardId: string;
}

const BoardSpace = ({ boardId }: BoardSpaceProps) => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;
    const { boards, setBoards } = useBoards();

    const [showInputSearch, setShowInputSearch] = useState(false);
    const handleShowInputSearch = () => setShowInputSearch(prev => !prev);
    const inputSearchRef = useRef<HTMLDivElement>(null);

    const realtimeBoards = useRealtime<"board">({
        room: "boards",
        entity: "board",
        initialData: boards
    })

    const initialItems = realtimeBoards.map(item => ({
        id: item.id,
        name: item.title
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

    useLayoutEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputSearchRef.current && !inputSearchRef.current.contains(event.target as Node)) {
                setShowInputSearch(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    if (!boards.find(board => board.id === boardId)) return redirect("/not-found");

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-5">
                <div className="flex items-center gap-2">
                    <RenderItems
                        initialItems={initialItems}
                        handleReorder={handleReorder}
                    />
                </div>
                <div className="flex items-center gap-5">
                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-transparent text-primary cursor-pointer hover:bg-primary/5
                        rounded-xl transition-colors border border-primary/5 hover:border-transparent"
                    >
                        <Plus size={14} />
                        <span className="text-sm">
                            List
                        </span>
                    </button>
                    <button
                        className="text-gray-400 hover:scale-105 cursor-pointer"
                    >
                        <Filter size={16} />
                    </button>
                    {
                        showInputSearch ?
                            <div
                                ref={inputSearchRef}
                                className="flex items-center rounded-full gap-3 border 
                                border-gray-300 px-3 py-0.5 animate-in fade-in zoom-in"
                            >
                                <input type="text" className="w-full outline-none" />
                                <Search size={16} className="text-gray-400" />
                            </div>
                            :
                            <button
                                className="text-gray-400 hover:scale-105 cursor-pointer 
                                animate-in fade-in zoom-in"
                                onClick={handleShowInputSearch}
                            >
                                <Search size={16} className="text-gray-400" />
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default BoardSpace;