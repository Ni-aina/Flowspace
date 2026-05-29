"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { ModalUI } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { createBoard } from "@/actions/boards/board.action";
import { LayoutGrid, Table, List } from "lucide-react";

interface NewBoardProps {
    onNewBoard: boolean;
    setOnNewBoard: (onNewBoard: boolean) => void;
}

const NewBoard = ({ onNewBoard, setOnNewBoard }: NewBoardProps) => {
    const workspace = useWorkspace(state => state.workspace);
    const [state, formAction, pending] = useActionState(createBoard, null);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("grid");

    const boardTypes = [
        { value: "grid", icon: LayoutGrid, label: "Grid" },
        { value: "table", icon: Table, label: "Table" },
        { value: "list", icon: List, label: "List" }
    ]

    const handleClose = useCallback(() => {
        setTitle("");
        setType("grid");
        setOnNewBoard(false);
    }, [])

    useEffect(() => {
        if (state?.success) handleClose();
    }, [
        state,
        handleClose
    ])

    if (!workspace) return null;

    return (
        <ModalUI
            isOpen={onNewBoard}
            onClose={handleClose}
            title="Create New Board"
            size="md"
        >
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <input type="hidden" name="type" value={type} />

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Type
                    </label>
                    <div className="flex gap-2">
                        {
                            boardTypes.map((boardType) => {
                                const Icon = boardType.icon;
                                return (
                                    <button
                                        key={boardType.value}
                                        type="button"
                                        onClick={() => setType(boardType.value)}
                                        disabled={pending}
                                        className={`
                                        flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                                        ${type === boardType.value
                                                ? 'border-primary/5 bg-primary/10'
                                                : 'border-input hover:border-primary/40'
                                            }
                                        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-xs font-medium">{boardType.label}</span>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <Input
                        id="title"
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter board title"
                        disabled={pending}
                        required
                    />
                </div>

                {
                    state?.error &&
                    <p className="text-sm text-red-500">{state.error}</p>
                }

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={pending}
                        className="px-4 py-2 rounded-lg border border-input cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={pending}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground 
                            cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {pending ? "Creating..." : "Create Board"}
                    </button>
                </div>
            </form>
        </ModalUI>
    )
}

export default NewBoard;