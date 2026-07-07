"use client";

import { Board, List } from "@prisma/client";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import DeleteConfirm from "../../ui/delete-confirm";
import { deleteList } from "@/actions/lists/list.action";
import ListForm from "../list-form";
import CardForm from "../../cards/card-forms/card-form";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useCards } from "@/stores/zustands/use-cards";
import { useRealtime } from "@/hooks/use-realtime";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableRow } from "./row";

interface ListCardProps {
    members: MemberInterface[];
    board: Board;
    list: List;
    dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

const ListCard = ({
    members,
    board,
    list,
    dragHandleProps
}: ListCardProps) => {
    const boardId = board.id
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id ?? null
    const cardsByList = useCards(state => state.cardsByList)
    const cards = cardsByList[list.id] || []

    const realtimeCards = useRealtime<"card">({
        room: workspaceId ? `workspace:${workspaceId}:list:${list.id}` : null,
        entity: "card",
        initialData: cards
    })

    const { active } = useDndContext()
    const activeCardListId = active?.data.current?.card?.listId

    const { isOver, setNodeRef } = useDroppable({
        id: `list:${list.id}`,
        disabled: activeCardListId === list.id,
        data: {
            type: "list",
            listId: list.id
        }
    })

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [open, setOpen] = useState(false)
    const [listId, setListId] = useState<string>("")
    const [onDelete, setOnDelete] = useState(false)
    const [cardFormOpen, setCardFormOpen] = useState(false)
    const [listUpdate, setListUpdate] = useState<{
        id: string;
        title: string;
        color: string;
        position: number;
    }>()

    const menuRef = useRef<HTMLDivElement>(null)

    const handleDelete = async () => {
        if (!listId) return
        setOnDelete(true)
        await deleteList(listId)
        setListId("")
    }

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    return (
        <>
            <div
                ref={setNodeRef}
                className={`
                    flex flex-col w-full sm:w-2/3 shrink-0 rounded-lg border border-input transition-colors overflow-hidden
                    ${isOver ? "bg-primary/5" : "bg-muted/30"}
                `}
            >
                <div
                    {...dragHandleProps}
                    className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border cursor-grab"
                    style={{
                        borderLeft: `4px solid ${list.color}`
                    }}
                >
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(prev => !prev)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {isCollapsed ?
                                <ChevronRight size={16} />
                                :
                                <ChevronDown size={16} />
                            }
                        </button>
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                                backgroundColor: list.color
                            }}
                        />
                        <h3 className="text-sm font-semibold truncate">{list.title}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{realtimeCards.length} cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCardFormOpen(true)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <Plus size={14} />
                        </button>
                        <div
                            ref={menuRef}
                            className="relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => {
                                    setOpen(prev => !prev)
                                    setIsCollapsed(false)
                                }}
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
                </div>
                {!isCollapsed &&
                    <div className="flex flex-col gap-2 p-3 bg-muted/5 rounded-b-lg border-t border-border">
                        {realtimeCards.length === 0 ?
                            <div className="text-center py-6 text-xs text-muted-foreground">
                                Create or drop a card here
                            </div>
                            :
                            <SortableContext
                                items={realtimeCards.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {realtimeCards.map(card =>
                                    <SortableRow
                                        key={card.id}
                                        card={card}
                                        listColor={list.color}
                                        members={members}
                                    />
                                )}
                            </SortableContext>
                        }
                    </div>
                }
            </div>
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
                members={members}
                initialAssignedIds={[]}
            />
        </>
    )
}

export default ListCard
