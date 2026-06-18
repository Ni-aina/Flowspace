import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode } from "react";

interface DraggableItemProps {
    id: string;
    children: ReactNode;
}

const DraggableItem = ({ id, children }: DraggableItemProps) => {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none"
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    )
}

export default DraggableItem;