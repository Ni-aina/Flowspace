"use client";

import { useCallback } from "react";
import { ModalUI } from "@/components/ui/modal";
import { Trash2 } from "lucide-react";

interface DeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    pending?: boolean;
    accentColor?: string;
}

const DeleteConfirm = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete",
    description = "This action cannot be undone.",
    pending = false,
    accentColor = "#ef4444"
}: DeleteConfirmProps) => {

    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm])

    return (
        <ModalUI
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md"
        >
            <div className="space-y-4">
                <div
                    className="flex items-start gap-3 p-3 rounded-lg border border-input"
                    style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}
                >
                    <Trash2 size={16} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={pending}
                        className="px-4 py-2 rounded-lg border border-input cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={pending}
                        className="px-4 py-2 rounded-lg text-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: accentColor }}
                    >
                        {pending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </ModalUI>
    )
}

export default DeleteConfirm;