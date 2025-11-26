import { isDevEnv } from './enviornment';

import type {
  RecordsState,
  TableMetaData,
  TableRecord,
} from '../types/baseDataTypes';

export const updateRow = async (
  tableData: TableMetaData,
  rowData: TableRecord
) => {
  if (isDevEnv()) {
    return;
  }

  const data: RecordsState = [tableData, rowData];
  let success: boolean = false;
  Microsoft.Dynamics.NAV.InvokeExtensibilityMethod(
    'UpdateRow',
    [data],
    success
  );
  if (success) {
    console.log('Row updated in BC');
  } else console.error('Row failed to update in BC');
};

export const getTableData = async (
  tableNumber: number,
  maxRecords: number,
  filterField?: string | number,
  filterText?: string
) => {
  if (isDevEnv()) {
    console.log('Dev Env true');
    try {
      const response = await fetch(`/mockData/${tableNumber}.json`);
      if (!response.ok) throw new Error('Mock data not found');
      let data = await response.json();

      // Filtering
      if (filterField && filterText) {
        data = data.filter((record: any) => {
          // Try direct property first
          if (
            record[filterField] != null &&
            String(record[filterField]).includes(filterText)
          ) {
            return true;
          }
          // Then check in the fields array
          if (Array.isArray(record.fields)) {
            return record.fields.some(
              (f: any) =>
                (f.name === filterField || f.id === filterField) &&
                f.value != null &&
                String(f.value).includes(filterText)
            );
          }
          return false;
        });
      }
      console.log('MaxRecords', maxRecords);
      if (maxRecords === 0){
        maxRecords = data.length;
        console.log(data.length);
      }
      // Limit to maxRecords
      const limitedData = data.slice(0, maxRecords);

      // Simulate BC event
      const event = new CustomEvent('BCData', { detail: limitedData });
      window.dispatchEvent(event);
      console.log('Dispatched mock BCData event:', event);
    } catch (err) {
      console.error('Error loading mock data:', err);
    }
  } else {
    if (filterField == undefined) filterField = 0;
    if (filterText == undefined) filterText = '';
    console.log('Max Records to Nav', maxRecords);
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [
      tableNumber,
      maxRecords,
      filterField,
      filterText,
    ]);
  }
};
