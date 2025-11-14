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
    const event = new CustomEvent('BCData', { detail: data });
    window.dispatchEvent(event);
    console.log(data);
  } catch (e) {
    console.error('Invalid Json from BC:', e, jsonData);
  }
};

window.addEventListener('BCData', (event: CustomEvent) => {
  const dataArray = event.detail;
  if (Array.isArray(dataArray)) {
    dataArray.forEach((record: any) => {
      const tableNumber = record.id || 'unknown';
      if (!capturedBCData.has(tableNumber)) {
        capturedBCData.set(tableNumber, []);
      }
      capturedBCData.get(tableNumber).push(record);
    });
    console.log(`✓ Captured tables: ${[...new Set(dataArray.map((r: any) => r.id))].join(', ')}`);
  } else {
    // fallback for non-array data
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


