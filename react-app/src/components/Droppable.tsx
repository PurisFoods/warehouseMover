import { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";


interface DroppableProps {
    children: ReactNode;
    id?: string;
}

export const Droppable: React.FC<DroppableProps> = ({children, id = 'droppable'}) => {
    const {isOver, setNodeRef} = useDroppable({
        'id': id,
    });

    const style = {
        color: isOver ? 'green' : undefined,
        width: '200px',
        height: '200px',
        border: '1px solid black',
        textAlign: 'center',

    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    )
}