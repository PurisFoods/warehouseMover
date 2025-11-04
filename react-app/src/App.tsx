import { useState, useEffect } from 'react';
import { 
  parseBCJson, 
  serializeToBCJson, 
  flattenBCRecord } 
  from './modules/bcTransformer';
import type { SimpleRecord,
  BCRecord } 
  from './modules/bcTransformer';
// //Types
// import type { DragEndEvent } from '@dnd-kit/core';
// import type { ReactNode } from 'react';

// //Components
// import { Draggable } from './components/Draggable';
// import { Droppable } from './components/Droppable';
import './App.css';


function App() {
   const [records, setRecords] = useState<SimpleRecord[]>([]);
   const [originalBCRecords, setOriginalBCRecords] = useState<BCRecord[]>([]);

  const handleReceiveData = (jsonString: string) => {
  const simpleRecords = parseBCJson(jsonString);
  const bcRecords = JSON.parse(jsonString);
  setRecords(simpleRecords);
  setOriginalBCRecords(bcRecords);
};

  // const addRecord = (newData: Partial<SimpleRecord>) => {
  //   const nextRecordLine = Math.max(...records.map(r => r.recordLine), 0) + 1;
  //   setRecords([...records, {
  //     recordLine: nextRecordLine,
  //     tableName: records[0]?.tableName || "PurisUsers",
  //     company: records[0]?.company || "PurisProteinsProduction",
  //     recordId: `${records[0]?.tableName}: ${nextRecordLine}`,
  //     ...newData
  //   }]);
  // };

  //   const updateRecord = (recordLine: number, updates: Partial<SimpleRecord>) => {
  //   setRecords(records.map(r => 
  //     r.recordLine === recordLine ? { ...r, ...updates } : r
  //   ));
  // };

  //   const saveToBC = () => {
  //   const bcJson = serializeToBCJson(records, originalBCRecords);
  //   CurrPage.WarehouseMover.SendDataToReact(bcJson);
  // };

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      handleReceiveData(JSON.stringify(customEvent.detail));
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
      Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('AddLines', [JSON.stringify(records)]);
  }
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

  // const handleAddLine(() => {
  //   const data: SimpleRecord;
  //   data = {

  //   }
  //   updateRecord()
  // })

  useEffect(() => {
    console.log('innerHeight', window.innerHeight);
  },[window.innerHeight])

  return (
    <div className='primaryContainer'>
      <h5>BCinReact</h5>
            <div className='buttonContainer'>
              {/* <button onClick={handleAddLine}>Add Line</button> */}
              <button onClick={sendDataToBC}>Send Data to BC</button>
              <button onClick={testMessage}>Test Message</button>
              <button onClick={() => getTableData(50260)}>Get Table Data Puris Users</button>
              <button onClick={() => getTableData(27)}>Get Items</button>
            </div>
            <div className='buttonContainer'>
              <button onClick={handleSalesPage}>Sales Orders</button>
            </div>

      <div className='secondaryContainer'>
      {records && 
        <pre className='jsonBox'>
          {JSON.stringify(records, null, 2)}
        </pre>
        }
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