import { useDraggable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DraggableProps {
    children: ReactNode;
    id?: string;
}

export const Draggable: React.FC<DraggableProps> = ({ children, id = 'draggable' }) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </button>
    )

}