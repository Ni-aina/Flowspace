import { useRef, useEffect, ReactNode } from "react";

type DraggableProps = {
    children: ReactNode;
    data: string;
}

const Draggable = (props: DraggableProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const dataRef = useRef(props.data)
    dataRef.current = props.data

    useEffect(() => {
        const element = ref.current

        if (!element) return

        element.draggable = true

        const onDragStart = (e: DragEvent): void => {
            e.dataTransfer?.setData("text/plain", dataRef.current)
        }

        const onDragEnd = (e: DragEvent): void => {
            e.dataTransfer?.clearData()
        }

        element.addEventListener("dragstart", onDragStart)
        element.addEventListener("dragend", onDragEnd)

        return (): void => {
            element.removeEventListener("dragstart", onDragStart)
            element.removeEventListener("dragend", onDragEnd)
        }
    }, [])

    return (
        <div ref={ref}>
            {props.children}
        </div>
    )
}

export default Draggable;