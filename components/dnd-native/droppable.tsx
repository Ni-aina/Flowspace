import { useRef, useEffect, ReactNode } from "react";

type DroppableProps = {
    children: ReactNode;
    onDrop: (data: string) => void;
}

const Droppable = (props: DroppableProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current

        if (!element) return

        const onDragOver = (e: DragEvent): void => {
            e.preventDefault()
        }

        const onDrop = (e: DragEvent): void => {
            e.preventDefault()
            const data = e.dataTransfer?.getData("text/plain")
            if (data) props.onDrop(data)
        }

        element.addEventListener("dragover", onDragOver)
        element.addEventListener("drop", onDrop)

        return (): void => {
            element.removeEventListener("dragover", onDragOver)
            element.removeEventListener("drop", onDrop)
        }
    }, [props.onDrop])

    return (
        <div ref={ref}>
            {props.children}
        </div>
    )
}

export default Droppable;