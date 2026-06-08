"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { ModalUI } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { createList, updateList } from "@/actions/lists/list.action";

interface ListFormProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
    initialData?: {
        id: string;
        title: string;
        color: string;
        position: number;
    }
}

const LIST_COLORS = [
    { value: "#6366f1", label: "Indigo" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#ec4899", label: "Pink" },
    { value: "#ef4444", label: "Red" },
    { value: "#f97316", label: "Orange" },
    { value: "#eab308", label: "Yellow" },
    { value: "#22c55e", label: "Green" },
    { value: "#06b6d4", label: "Cyan" }
]

const DEFAULT_COLOR = "#6366f1";

const ListForm = ({ isOpen, onClose, boardId, initialData }: ListFormProps) => {
    const workspace = useWorkspace(state => state.workspace);
    const isEditing = !!initialData;
    const action = isEditing ? updateList : createList;
    const [state, formAction, pending] = useActionState(action, null);

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [color, setColor] = useState(initialData?.color ?? DEFAULT_COLOR);

    const handleClose = useCallback(() => {
        setTitle(initialData?.title ?? "");
        setColor(initialData?.color ?? DEFAULT_COLOR);
        onClose();
    }, [initialData, onClose])

    useEffect(() => {
        if (state?.success) {
            handleClose();
            state.success = false;
        }
    }, [
        state,
        handleClose
    ])

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title ?? "");
            setColor(initialData?.color ?? DEFAULT_COLOR);
        }
    }, [isOpen, initialData])

    if (!workspace) return null;

    return (
        <ModalUI
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Edit List" : "Create New List"}
            size="md"
        >
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="boardId" value={boardId} />
                <input type="hidden" name="color" value={color} />
                <input type="hidden" name="position" value={initialData?.position ?? 0} />

                {isEditing && <input type="hidden" name="listId" value={initialData.id} />}

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
                        placeholder="e.g. Not Started, In Progress, Done..."
                        disabled={pending}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {
                            LIST_COLORS.map((c) =>
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    disabled={pending}
                                    title={c.label}
                                    className={`
                                        w-8 h-8 rounded-lg border-2 transition-all cursor-pointer
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        ${color === c.value ? "border-foreground" : "border-transparent hover:scale-105"}
                                    `}
                                    style={{ backgroundColor: c.value }}
                                />
                            )
                        }
                    </div>
                </div>

                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-input"
                    style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                >
                    <span className="text-sm text-muted-foreground">
                        {title || "List preview"}
                    </span>
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
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create List")}
                    </button>
                </div>
            </form>
        </ModalUI>
    )
}

export default ListForm;