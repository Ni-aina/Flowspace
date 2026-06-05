"use client";

import { useRealtime } from "@/hooks/use-realtime";
import { useBoards, useLoadingBoards } from "@/stores/zustands/use-boards";
import RenderItems from "../drag&drop/horizontals/renderItems";
import { OrderItem } from "../drag&drop/horizontals/orderItems";
import { setBoardPositions } from "@/actions/boards/board.action";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Board, List } from "@prisma/client";
import { Filter, Plus, Search } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import NewList from "../lists/new-list";
import ListItems from "../lists/items";

interface BoardSpaceInterface {
    boardId: string;
    lists: List[];
}

const BoardSpace = ({ boardId, lists }: BoardSpaceInterface) => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;
    const { boards, setBoards } = useBoards();
    const { loading } = useLoadingBoards();

    const [showInputSearch, setShowInputSearch] = useState(false);
    const handleShowInputSearch = () => setShowInputSearch(prev => !prev);
    const inputSearchRef = useRef<HTMLDivElement>(null);

    const [onNewList, setOnNewList] = useState(false);

    const realtimeBoards = useRealtime<"board">({
        room: "boards",
        entity: "board",
        initialData: boards
    })

    const initialItems = realtimeBoards.map(item => ({
        id: item.id,
        name: item.title,
        type: item.type,
        link: `/dashboard/boards/${item.id}`
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

    return (
        <>
            <div className="p-4 lg:p-8 space-y-4 lg:space-y-8">
                <div className="flex flex-wrap justify-between items-center gap-5">
                    {
                        loading ?
                            <div className="flex item-center gap-2">
                                <div className="w-32 h-8 bg-primary/5 rounded-full animate-pulse"></div>
                                <div className="w-32 h-8 bg-primary/5 rounded-full animate-pulse"></div>
                            </div>
                            :
                            <div className="flex flex-wrap items-center gap-1">
                                <RenderItems
                                    initialItems={initialItems}
                                    handleReorder={handleReorder}
                                />
                            </div>
                    }
                    <div className="flex items-center gap-5">
                        <button
                            className="flex items-center gap-1 px-3 py-1 bg-transparent text-primary cursor-pointer hover:bg-primary/5
                            rounded-full transition-colors border border-primary/5 hover:border-transparent"
                            onClick={() => setOnNewList(true)}
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
                <ListItems lists={lists} />
            </div>
            <NewList
                onNewList={onNewList}
                setOnNewList={setOnNewList}
                boardId={boardId}
            />
        </>
    )
}

export default BoardSpace;