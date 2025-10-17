import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';

//Types
import type { DragEndEvent } from '@dnd-kit/core';
import type { ReactNode } from 'react';

//Components
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
// import './App.css'

interface BCDataType {
  [key: string]: any;
}

function App() {
  const [bcData, setBcData] = useState<BCDataType | null>(null);
  const [isDropped, setIsDropped] = useState<boolean>(false);
  const draggableMarkup: ReactNode = (<Draggable>Drag Me</Draggable>);
 
  const handleDragEnd = (event: DragEndEvent): void => {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      setBcData(customEvent.detail);
    };
    window.addEventListener('BCData', handler);
    return () => {
      window.removeEventListener('BCData', handler);
    }
  }, []);

  useEffect(() => {
    if (bcData) {
      console.log(bcData);
    }
  }, [bcData]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Droppable>
        {isDropped ? draggableMarkup : 'Drop Here'}
      </Droppable>
    </DndContext>
  )
}
export default App