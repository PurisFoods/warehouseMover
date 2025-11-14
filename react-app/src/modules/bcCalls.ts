import { isDevEnv } from './enviornment';

export const getTableData = async (
  tableNumber: number,
  filterField?: number,
  filterText?: string
) => {
  if (isDevEnv()) {
    console.log('Dev Env true');
    try {
      const response = await fetch(`/mockData/${tableNumber}.json`);
      if (!response.ok) throw new Error('Mock data not found');
      console.log(response);
      let data = await response.json();
      // Ensure data is always an array
      if (!Array.isArray(data)) {
        data = [data];
      }

      // Simulate BC event
      const event = new CustomEvent('BCData', { detail: data });
      window.dispatchEvent(event);
      console.log('Dispatched mock BCData event:', event);
    } catch (err) {
      console.error('Error loading mock data:', err);
    }
  } else {
    if (filterField == undefined) filterField = 0;
    if (filterText == undefined) filterText = '';

    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [
      tableNumber,
      filterField,
      filterText,
    ]);
  }
};
