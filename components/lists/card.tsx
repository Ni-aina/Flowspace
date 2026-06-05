"use client";

import { List } from "@prisma/client";
import React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ListCardProps {
    list: List;
    children?: React.ReactNode;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ListCard = ({ list, children, dragHandleProps }: ListCardProps) => {
    const count = React.Children.count(children);
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

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
        <div className="flex flex-col w-64 shrink-0 rounded-lg border border-input bg-muted/30">
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
                    {
                        open &&
                        <div className="absolute right-0 top-full mt-1 z-50 min-w-30 rounded-md border border-input bg-popover shadow-md py-1">
                            <button
                                onClick={() => setOpen(false)}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                            >
                                <Pencil size={12} className="text-amber-500" />
                                Edit
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={12} className="text-red-500" />
                                Delete
                            </button>
                        </div>
                    }
                </div>
            </div>

            {
                count > 0 &&
                <div className="flex flex-col gap-2 p-2">
                    {children}
                </div>
            }

            {
                count === 0 &&
                <div className="flex items-center justify-center px-3 py-4">
                    <p className="text-xs text-muted-foreground">No cards yet</p>
                </div>
            }
        </div>
    )
}

export default ListCard;