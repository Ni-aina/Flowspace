"use client";

import { List } from "@prisma/client";
import React from "react";

interface ListCardProps {
    list: List;
    children?: React.ReactNode;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const ListCard = ({ list, children, dragHandleProps }: ListCardProps) => {
    const count = React.Children.count(children);

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
                <span className="text-xs text-muted-foreground">{count}</span>
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