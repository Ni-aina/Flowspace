import { useDroppable } from "@dnd-kit/core";
import { CSSProperties, ReactNode } from "react";

interface DroppableBlockProps {
    id: string;
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
}

const DroppableBlock = ({ id, children, style, className }: DroppableBlockProps) => {

    const { setNodeRef, isOver } = useDroppable({ id });

    const mergedStyle: CSSProperties = {
        transition: "outline 0.15s ease",
        ...style
    }

    return (
        <div ref={setNodeRef} style={mergedStyle} className={className}>
            {children}
        </div>
    )
}

export default DroppableBlock;