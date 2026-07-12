"use client";

import { useRealtime } from "@/hooks/use-realtime";
import { useBoards, useLoadingBoards } from "@/stores/zustands/use-boards";
import RenderItems from "./dnd/render-items";
import { OrderItem } from "./dnd/order-items";
import { setBoardPositions } from "@/actions/boards/board.action";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { Board, List } from "@prisma/client";
import { Filter, Plus, Search } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import ListGrids from "../status/grids/items";
import ListTables from "../status/tables/items";
import ListLists from "../status/lists/items";
import ListForm from "../status/list-form";
import BoardForm from "./board-form";

interface BoardSpaceInterface {
    members: MemberInterface[];
    board: Board;
    lists?: List[];
}

const BoardSpace = ({ members, board, lists }: BoardSpaceInterface) => {
    const workspace = useWorkspace(state => state.workspace);
    const workspaceId = workspace?.id;
    const { boards, setBoards } = useBoards();
    const { loading } = useLoadingBoards();

    const [showInputSearch, setShowInputSearch] = useState(false);
    const handleShowInputSearch = () => setShowInputSearch(prev => !prev);
    const inputSearchRef = useRef<HTMLDivElement>(null);

    const [onNewBoard, setOnNewBoard] = useState(false);
    const [onNewList, setOnNewList] = useState(false);

    const handleShowBoard = () => setOnNewBoard(prev => !prev);

    const realtimeBoards = useRealtime<"board">({
        room: workspaceId ? `workspace:${workspaceId}:board` : null,
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
                            <div className="flex flex-wrap item-center gap-2">
                                <div className="w-48 h-8 bg-primary/5 rounded-full animate-pulse"></div>
                                <div className="w-48 h-8 bg-primary/5 rounded-full animate-pulse"></div>
                            </div>
                            :
                            <div className="flex items-center gap-5">
                                <div className="flex flex-wrap items-center gap-1">
                                    <RenderItems
                                        initialItems={initialItems}
                                        handleReorder={handleReorder}
                                        direction="horizontal"
                                    />
                                </div>
                                <div className="self-stretch items-start">
                                    <button
                                        onClick={handleShowBoard}
                                        className="bg-primary/5 rounded-full p-1 shadow-2xl cursor-pointer hover:bg-primary/10"
                                        title="Add Board"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                    }
                    {
                        showInputSearch ?
                            <div
                                ref={inputSearchRef}
                                className="flex items-center rounded-full gap-3 border 
                                border-gray-300 px-3 py-1 animate-in fade-in zoom-in"
                            >
                                <input
                                    type="text"
                                    className="w-full outline-none text-sm"
                                    placeholder="Search ..."
                                />
                                <Search size={16} className="text-gray-400" />
                            </div>
                            :
                            <div className="flex items-center gap-5">
                                <button
                                    className="flex items-center gap-1 px-3 py-1 bg-transparent text-primary cursor-pointer hover:bg-primary/5
                                    rounded-full transition-colors border border-primary/5 hover:border-transparent"
                                    onClick={() => setOnNewList(true)}
                                >
                                    <Plus size={14} />
                                    <span className="text-sm">
                                        Status
                                    </span>
                                </button>
                                <button
                                    className="text-gray-400 hover:scale-105 cursor-pointer"
                                    title="Filter"
                                >
                                    <Filter size={16} />
                                </button>
                                <button
                                    className="text-gray-400 hover:scale-105 cursor-pointer 
                                    animate-in fade-in zoom-in"
                                    onClick={handleShowInputSearch}
                                    title="Search"
                                >
                                    <Search size={16} className="text-gray-400" />
                                </button>
                            </div>
                    }
                </div>
                {
                    board?.type === "grid" && lists &&
                    <ListGrids
                        members={members}
                        board={board}
                        lists={lists}
                    />
                }
                {
                    board?.type === "table" && lists &&
                    <ListTables
                        members={members}
                        board={board}
                        lists={lists}
                    />
                }
                {
                    board?.type === "list" && lists &&
                    <ListLists
                        members={members}
                        board={board}
                        lists={lists}
                    />
                }
            </div>
            <BoardForm
                isOpen={onNewBoard}
                setOpen={setOnNewBoard}
            />
            <ListForm
                isOpen={onNewList}
                onClose={() => setOnNewList(false)}
                boardId={board?.id}
            />
        </>
    )
}

export default BoardSpace;