import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App.js'

declare global {
  interface Window {
    downloadBCData: (tableNumber?: number) => void;
    SendDataToReact: (jsonData: string) => void;
  }
}

const rootElementId = (window.self !== window.top)
  ? "controlAddIn"
  : "root";

let capturedBCData: Map<number, any> = new Map();

function mountApp() {
  const container = document.getElementById(rootElementId)
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <FluentProvider theme={webLightTheme}>
          <App />
        </FluentProvider>
      </StrictMode>,
    )
  } else {
    setTimeout(mountApp, 50)
  }
}

document.addEventListener('DOMContentLoaded', mountApp);

(window as any).SendDataToReact = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);

    console.log(typeof data, data.length);
    console.log('parsed data from BC', data);

    const event = new CustomEvent('BCData', { detail: data });
    window.dispatchEvent(event);
  } catch (e) {
    console.error('Invalid Json from BC:', e, jsonData);
  }
};

window.addEventListener('BCData', (event: CustomEvent) => {

  // const data = JSON.parse(event.detail);

  console.log('saver function called - ', event.detail);
  console.log('event.detail.length', event.detail.length);
  console.log('event.detail[0] length', event.detail[0].length);

  const dataArray = event.detail[0];

  console.log(Array.isArray(dataArray), dataArray.length, event.detail.length);
  console.log('0', dataArray[0]);

  if (Array.isArray(dataArray) && dataArray.length > 1) {
    const header = dataArray[0];

    console.log('header', header);

    const records = dataArray.slice(1);
    const tableNumber = header.tableNumber || 'unknown';

    console.log('tableNumber', tableNumber);

    capturedBCData.set(tableNumber, records);
    console.log(`✓ Captured table ${tableNumber} (${header.tableName}), ${records.length} records`);
  } else if (Array.isArray(dataArray) && dataArray.length === 1) {
    // Only header, no records
    const header = dataArray[0];
    const tableNumber = header.tableNumber || 'unknown';
    capturedBCData.set(tableNumber, []);
    console.log(`✓ Captured table ${tableNumber} (${header.tableName}), 0 records`);
  } else {
    // fallback for non-array data

    console.log('else ran');

    const tableNumber = dataArray.id || 'unknown';
    capturedBCData.set(tableNumber, [dataArray]);
    console.log(`✓ Captured table ${tableNumber}`);
  }
});

window.downloadBCData = function downloadBCData(tableNumber?: number) {
  let dataToDownload = tableNumber
    ? capturedBCData.get(tableNumber)
    : Object.fromEntries(capturedBCData);

  if (!dataToDownload) {
    console.error(`No data captured for table ${tableNumber}`);
    return;
  }

  const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tableNumber || 'allMockData'}.json`;
  link.click();
  URL.revokeObjectURL(url);
  console.log(`✓ Downloaded ${link.download}`);
};

console.log('downloadBCData assigned:', typeof window.downloadBCData);


