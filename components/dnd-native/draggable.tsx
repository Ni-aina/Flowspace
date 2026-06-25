"use client";

import { ReactNode, DragEvent } from "react";

interface DraggableProps {
    id: string;
    type: string;
    children: ReactNode;
    className?: string;
}

const Draggable = ({ id, type, children, className }: DraggableProps) => {

    const handleDragStart = (e: DragEvent) => {
        e.dataTransfer.setData("text/plain", id)
        e.dataTransfer.setData("application/x-drag-type", type)
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className={className}
        >
            {children}
        </div>
    )
}

export default Draggable;