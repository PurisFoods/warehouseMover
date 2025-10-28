import { useState, useEffect } from 'react';
// import { DndContext } from '@dnd-kit/core';

// //Types
// import type { DragEndEvent } from '@dnd-kit/core';
// import type { ReactNode } from 'react';

// //Components
// import { Draggable } from './components/Draggable';
// import { Droppable } from './components/Droppable';
// import './App.css'

interface BCDataType {
  [key: string]: any;
}

function App() {
  const [bcData, setBcData] = useState<BCDataType[]>([]);
  // const [isDropped, setIsDropped] = useState<boolean>(false);
  // const draggableMarkup: ReactNode = (<Draggable>Drag Me</Draggable>);
 
  // const handleDragEnd = (event: DragEndEvent): void => {
  //   if (event.over && event.over.id === 'droppable') {
  //     setIsDropped(true);
  //   }
  // }

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      setBcData(customEvent.detail);
      console.log(customEvent.detail);
    };
    window.addEventListener('BCData', handler);
    return () => {
      window.removeEventListener('BCData', handler);
    }
  }, []);

  const sendDataToBC = () => {
    console.log(Microsoft?.Dynamics);

        if (Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod) {
      Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('AddLines', [JSON.stringify(bcData)]);
  }
}

  const handleAddLine = () => {
    const newItem: BCDataType = {
      'UserName': "reactUser",
      'data1': "HiFromReact"
    }
    setBcData((prevState: BCDataType[]) => [...prevState, newItem]);
  }

  const testMessage = () => {
    console.log(Microsoft?.Dynamics);
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('ReceiveDataFromReact', ['This is the message'])
  }

  return (
    <div className='primaryContainer'>
      <h5>BCinReact</h5>
      <ul>
        {bcData.length > 0 ? (
          bcData.map((item: BCDataType, index: number) => (
            <li key={index}>{item.UserName} - {item.data1} - {item.data2}</li>
          ))
        ) : (
          <li>No data received</li>
        )}
      </ul>
      <button onClick={handleAddLine}>Add Line</button>
      <button onClick={sendDataToBC}>Send Data to BC</button>
      <button onClick={testMessage}>Test Message</button>
    </div>
    // <DndContext onDragEnd={handleDragEnd}>
    //   {!isDropped ? draggableMarkup : null}
    //   <Droppable>
    //     {isDropped ? draggableMarkup : 'Drop Here'}
    //   </Droppable>
    // </DndContext>
  )
}
export default App