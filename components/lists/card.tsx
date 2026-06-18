"use client";

import { List } from "@prisma/client";
import React from "react";
import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import DeleteConfirm from "../ui/deleteConfirm";
import { deleteList } from "@/actions/lists/list.action";
import ListForm from "./list-form";
import CardForm from "../cards/card-forms/card-form";
import { useBoard } from "@/stores/zustands/use-board";
import CardList from "../cards/card-list";
import DroppableBlock from "@/components/dnd/droppable-block";

interface ListCardProps {
    list: List;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ListCard = ({ list, dragHandleProps }: ListCardProps) => {

    const { board } = useBoard();
    const boardId = board.id;

    const [open, setOpen] = React.useState(false);
    const [listId, setListId] = React.useState<string>("");
    const [onDelete, setOnDelete] = React.useState(false);
    const [cardFormOpen, setCardFormOpen] = React.useState(false);
    const [listUpdate, setListUpdate] = React.useState<{
        id: string;
        title: string;
        color: string;
        position: number;
    }>()

    const menuRef = React.useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        if (!listId) return;
        setOnDelete(true);
        await deleteList(listId);
        setListId("");
    }

    React.useEffect(() => {
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
            <DroppableBlock
                id={list.id}
                className="flex flex-col w-64 shrink-0 rounded-lg border border-input bg-muted/30"
            >
                <div
                    {...dragHandleProps}
                    className="flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-grab"
                    style={{ backgroundColor: `${list.color}20`, borderBottom: `1px solid ${list.color}40` }}
                >
                    <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: list.color }}
                    />
                    <h3 className="text-sm font-semibold flex-1 truncate">{list.title}</h3>
                    <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground cursor-pointer hover:bg-black/5 transition-colors"
                        >
                            <MoreVertical className="h-3 w-3" />
                        </button>
                        {open &&
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-30 rounded-md border border-input bg-popover shadow-md py-1">
                                <button
                                    onClick={() => {
                                        setListUpdate({
                                            id: list.id,
                                            title: list.title,
                                            color: list.color,
                                            position: list.position
                                        })
                                        setOpen(false)
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                                >
                                    <Pencil size={12} className="text-amber-500" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setListId(list.id)
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
                <div className="flex flex-col gap-2 p-1">
                    <CardList listId={list.id} />
                </div>
                <div className="p-1">
                    <button
                        onClick={() => setCardFormOpen(true)}
                        className="w-full flex items-center gap-1.5 text-xs text-muted-foreground 
                        hover:text-foreground hover:bg-muted/50 rounded-sm py-1.5 px-2 transition-colors cursor-pointer"
                    >
                        <Plus size={12} />
                        Add a card
                    </button>
                </div>
            </DroppableBlock>
            <DeleteConfirm
                isOpen={!!listId}
                onClose={() => setListId("")}
                onConfirm={handleDelete}
                pending={onDelete}
                title="Delete List"
                description="Are you sure you want to delete this list?"
            />
            <ListForm
                isOpen={!!listUpdate}
                onClose={() => setListUpdate(undefined)}
                initialData={listUpdate}
                boardId={boardId}
            />
            <CardForm
                isOpen={cardFormOpen}
                onClose={() => setCardFormOpen(false)}
                listId={list.id}
            />
        </>
    )
}

export default ListCard;