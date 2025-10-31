import { useState, useEffect } from 'react';
import type { JSX } from 'react';
// import { DndContext } from '@dnd-kit/core';

// //Types
// import type { DragEndEvent } from '@dnd-kit/core';
// import type { ReactNode } from 'react';

// //Components
// import { Draggable } from './components/Draggable';
// import { Droppable } from './components/Droppable';
import './App.css';

interface BCDataType {
  [key: string]: any;
}

function App() {
  const [bcData, setBcData] = useState<any>([]);
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
    setBcData((prevState: any[]) => [...prevState, newItem]);
  }

  const testMessage = () => {
    console.log(Microsoft?.Dynamics);
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('ReceiveDataFromReact', ['This is the message'])
  }

  const handleSalesPage = () => {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GoToPage', [1]);
  }

  const getTableData = (tableNumber: Number) => {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [tableNumber]);
  }

  useEffect(() => {
    console.log('innerHeight', window.innerHeight);
  },[window.innerHeight])

  return (
    <div className='primaryContainer'>
      <h5>BCinReact</h5>
            <div className='buttonContainer'>
              <button onClick={handleAddLine}>Add Line</button>
              <button onClick={sendDataToBC}>Send Data to BC</button>
              <button onClick={testMessage}>Test Message</button>
              <button onClick={() => getTableData(50260)}>Get Table Data Puris Users</button>
              <button onClick={() => getTableData(27)}>Get Items</button>
            </div>
            <div className='buttonContainer'>
              <button onClick={handleSalesPage}>Sales Orders</button>
            </div>

      <div className='secondaryContainer'>
        <p>
          {bcData.map((line: any) => (
            <pre>{line.fields.map((item: any) => (
              <>
              <pre>{item.name}</pre>
              <pre>{item.value}</pre>
              </>

              ))}
            </pre>
          ))}
        </p>
      </div>
    
<div className='secondaryContainer'>
      <ul>
        {bcData.length > 0 ? (
          bcData.map((item: any, index: number) => {
            const values: any[] = Object.values(item).slice(0, 5);
            return (
              <li key={index}>
                {values.map((val: string | number | boolean, i: number) => (
                  <span key={i}>{String(val)}</span>
                )).reduce((prev: JSX.Element, curr: JSX.Element) => (
                  <>
                    {prev} - {curr}
                  </>
                ))}
              </li>
            );
          })
        ) : (
          <li>No data received</li>
        )}
      </ul>
      <div className='secondaryContainer'>
      {bcData && 
        <pre className='jsonBox'>
          {JSON.stringify(bcData, null, 2)}
        </pre>
        }
        </div>
        </div>

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