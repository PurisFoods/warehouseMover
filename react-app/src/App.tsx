import React, { useState, useEffect } from 'react';
import { serializeToBCJson } from './modules/bcTransformer';
import type { RecordsState } from './types/baseDataTypes';

import { getTableData } from './modules/bcCalls';

import { BinContent } from './components/BinContents';

import './App.css';
import { GetMockData } from './components/GetMockData';
import { ButtonsBox } from './components/ButtonsBox';
import { TableGrid } from './components/TableGrid';
import { Button } from '@fluentui/react-components';


function App() {
  const [records, setRecords] = useState<RecordsState>();
  const [tableNumber, setTableNumber] = useState<number>(37);
  const [maxRecords, setMaxRecords] = useState<number>(5);

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      setRecords(customEvent.detail);
      console.log('customEvent.detail', customEvent.detail);
    };

    window.addEventListener('BCData', handler);
    return () => {
      window.removeEventListener('BCData', handler);
    }
  }, []);

  useEffect(() => {
    console.log('Records useEffect', records);
  },[records])


  const handleGrid = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    getTableData(tableNumber, maxRecords);
  }

  useEffect(() => {
    console.log('innerHeight', window.innerHeight);
  }, [window.innerHeight]);

  const handleTriggerBC = () => {
    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ReceiveDataFromReact', ["message from react - blargh!"]);
  }

  return (
    <div className='primaryContainer'>

      <h5>BCinReact</h5>
      {/* <GetMockData /> */}
      <div className='secondaryContainer'>
        <div className='gridBox' style={{width: '100%', height: '100%'}}>
          <Button onClick={handleTriggerBC}>Trigger BC</Button>
        <form>
          <label>Enter Table Number for datagrid</label>
          <input type='text' value={tableNumber.toString()} onChange={(e) => setTableNumber(Number(e.target.value))} />
          <label>Max Records</label>
          <input type='text' value={maxRecords.toString()} onChange={(e) => setMaxRecords(Number(e.target.value))} />
          <button type='submit' onClick={handleGrid}>Go</button>
        </form>
        </div>
        <div style={{ border: '1px solid pink'}}>
        {records &&
          <TableGrid records={records} setRecords={setRecords} />
        }
        </div>
      </div>

      {/* <BinContent records={records} setRecords={setRecords} /> */}

      {/* <div className='buttonContainer'>
        <button onClick={handleAddLine}>Add Line</button>
        <button onClick={saveToBC}>Send Data to BC</button>
        <button onClick={() => getTableData(7302, 500)}>Get Table Data Puris Users</button>
        <button onClick={() => getTableData(27, 500)}>Get Items</button>
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
      </div> */}
    </div>
  )
}
export default App