"use client";

import { DragEvent, ReactNode, useState } from "react";

interface DroppableProps {
    id: string;
    accepts: string;
    onDropItem: (draggedId: string) => void;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
}

const Droppable = ({
    id,
    accepts,
    onDropItem,
    children,
    className,
    activeClassName
}: DroppableProps) => {

    const [isOver, setIsOver] = useState(false)

    const handleDragOver = (e: DragEvent) => {
        const type = e.dataTransfer.types.includes("application/x-drag-type")
        if (!type) return
        e.preventDefault()
        setIsOver(true)
    }

    const handleDragLeave = () => {
        setIsOver(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsOver(false)
        const draggedType = e.dataTransfer.getData("application/x-drag-type")
        if (draggedType !== accepts) return
        const draggedId = e.dataTransfer.getData("text/plain")
        onDropItem(draggedId)
    }

    return (
        <div
            id={id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${className} ${isOver ? activeClassName : ""}`}
        >
            {children}
        </div>
    )
}

export default Droppable;