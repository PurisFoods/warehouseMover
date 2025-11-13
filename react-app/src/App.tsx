import React, { useState, useEffect } from 'react';
import {
  parseBCJson,
  serializeToBCJson,
}
  from './modules/bcTransformer';
import type {
  SimpleRecord,
  BCRecord
}
  from './modules/bcTransformer';

import { getTableData } from './modules/bcCalls';

import { BinContent } from './components/binContents';

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

  const saveToBC = () => {
    const bcJson = serializeToBCJson(records, originalBCRecords);

    console.log('bcJson', bcJson);

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

    // Log current state before update
    console.log('Current records:', records);
    console.log('Original BC records:', originalBCRecords);

    const updatedRecords = records.map(record =>
      record.recordLine === 1
        ? { ...record, data1: changeData1 }
        : record
    );

    // Log the updated records
    console.log('Updated records:', updatedRecords);

    const bcJson = serializeToBCJson(updatedRecords, originalBCRecords);

    // Log final JSON
    console.log('Final BC JSON:', bcJson);

    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ReceiveDataFromReact', [bcJson]);
    setRecords(updatedRecords);
    setChangeData1('');
  }

  useEffect(() => {
    console.log('innerHeight', window.innerHeight);
  }, [window.innerHeight])

  return (
    <div className='primaryContainer'>
      <h5>BCinReact</h5>

      <BinContent records={records} setRecords={setRecords} />

      <div className='buttonContainer'>
        <button onClick={handleAddLine}>Add Line</button>
        <button onClick={saveToBC}>Send Data to BC</button>
        <button onClick={() => getTableData(7302, 1, "DAWSON")}>Get Table Data Puris Users</button>
        <button onClick={() => getTableData(27)}>Get Items</button>
      </div>
      <div className='buttonContainer'>
        <form onSubmit={handleSubmit}>
          <input type='text' onChange={(e) => setChangeData1(e.target.value)} placeholder='Data1' value={changeData1}></input>
          <button type='submit'>Submit</button>
        </form>
      </div>


      <div className='secondaryContainer' style={{ display: 'none' }}>
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