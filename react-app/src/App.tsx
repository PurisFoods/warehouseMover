import React, { useState, useEffect } from 'react';
import { 
  parseBCJson, 
  serializeToBCJson, 
  flattenBCRecord } 
  from './modules/bcTransformer';
import type { SimpleRecord,
  BCRecord } 
  from './modules/bcTransformer';

import './App.css';


function App() {
   const [records, setRecords] = useState<SimpleRecord[]>([]);
   const [originalBCRecords, setOriginalBCRecords] = useState<BCRecord[]>([]);
   const [changeData1, setChangeData1] = useState<string>('');

  const handleReceiveData = (jsonString: string) => {
  const simpleRecords = parseBCJson(jsonString);
  const bcRecords = JSON.parse(jsonString);
  setRecords(simpleRecords);
  setOriginalBCRecords(bcRecords);
};

  const addRecord = (newData: Partial<SimpleRecord>) => {
    const nextRecordLine = Math.max(...records.map(r => r.recordLine), 0) + 1;
    setRecords([...records, {
      recordLine: nextRecordLine,
      tableName: records[0]?.tableName || "PurisUsers",
      company: records[0]?.company || "PurisProteinsProduction",
      recordId: `${records[0]?.tableName}: ${nextRecordLine}`,
      ...newData
    }]);
  };

    const updateRecord = (recordLine: number, updates: Partial<SimpleRecord>) => {
    setRecords(records.map(r => 
      r.recordLine === recordLine ? { ...r, ...updates } : r
    ));
  };

    const saveToBC = () => {
    const bcJson = serializeToBCJson(records, originalBCRecords);
    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ReceiveDataFromReact', [bcJson]);
  };

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

  const handleSalesPage = () => {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GoToPage', [1]);
  }

  const getTableData = (tableNumber: Number) => {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [tableNumber]);
  }

  const handleAddLine = () => {
    const data: Partial<SimpleRecord> = {
      "UserName": 'newReactUser',
      "Data1": 'added data line',
      "Data2": 'added data line 2'
    }
    addRecord(data);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData = {
      "data1": changeData1
    }
    updateRecord(1, updatedData);
    saveToBC();
  }

  useEffect(() => {
    console.log('innerHeight', window.innerHeight);
  },[window.innerHeight])

  return (
    <div className='primaryContainer'>
      <h5>BCinReact</h5>
            <div className='buttonContainer'>
              <button onClick={handleAddLine}>Add Line</button>
              <button onClick={saveToBC}>Send Data to BC</button>
              <button onClick={() => getTableData(50260)}>Get Table Data Puris Users</button>
              <button onClick={() => getTableData(27)}>Get Items</button>
            </div>
            <div className='buttonContainer'>
              <form onSubmit={handleSubmit}>
                <input type='text' onChange={(e) => setChangeData1(e.target.value)} placeholder='Data1' value={changeData1}></input>
                <button type='submit'>Submit</button>
              </form>
            </div>

      <div className='secondaryContainer'>
      {records && 
        <pre className='jsonBox'>
          {JSON.stringify(records, null, 2)}
        </pre>
        }
        </div>
        </div>
  )
}
export default App