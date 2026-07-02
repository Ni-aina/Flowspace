"use client";

import { OrderItem } from "./dnd/order-items";
import { LayoutGrid, List, Table, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import BoardForm from "./board-form";
import DeleteConfirm from "../ui/delete-confirm";
import { deleteBoard } from "@/actions/boards/board.action";

interface BoardCardProps {
    item: OrderItem;
    isActive?: boolean;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    direction: "horizontal" | "vertical";
}

const BoardCard = ({
    item,
    isActive,
    dragHandleProps,
    direction
}: BoardCardProps) => {
    const [open, setOpen] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [boardId, setBoardId] = useState("");
    const [onDelete, setOnDelete] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        if (!boardId) return;
        setOnDelete(true);
        await deleteBoard(boardId);
        setOnDelete(false);
    }

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open])

    return (
        <>
            <div
                className={`
                    flex items-center rounded-full gap-2 px-3 py-1
                    ${direction === "horizontal" ? 'w-60 sm:w-50' : 'w-full'}
                    hover:bg-primary/5
                    ${isActive ? 'bg-primary/5' : ''}
                `}
            >
                <div
                    className="flex items-center gap-2 cursor-grab"
                    {...dragHandleProps}
                >
                    {item.type === "grid" && <LayoutGrid size={16} className="text-gray-400" />}
                    {item.type === "table" && <Table size={16} className="text-gray-400" />}
                    {item.type === "list" && <List size={16} className="text-gray-400" />}
                </div>
                <Link href={item.link} className="flex-1 truncate text-sm">
                    {item.name}
                </Link>
                <div
                    ref={menuRef}
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground cursor-pointer hover:bg-black/5 transition-colors"
                    >
                        <MoreVertical className="h-3 w-3" />
                    </button>
                    {
                        open &&
                        <div className="absolute right-0 top-full mt-1 z-50 min-w-30 rounded-md border border-input bg-popover shadow-md py-1">
                            <button
                                onClick={() => {
                                    setOnEdit(true)
                                    setOpen(false)
                                }}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                            >
                                <Pencil size={12} className="text-amber-500" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setBoardId(item.id as string)
                                    setOpen(false)
                                }}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={12} className="text-red-500" />
                                Delete
                            </button>
                        </div>
                    }
                </div>
            </div>
            <BoardForm
                isOpen={onEdit}
                setOpen={setOnEdit}
                board={item}
            />
            <DeleteConfirm
                isOpen={!!boardId}
                onClose={() => setBoardId("")}
                onConfirm={handleDelete}
                pending={onDelete}
                title="Delete Board"
                description="Are you sure you want to delete this board?"
            />
        </>
    )
}

export default BoardCard;