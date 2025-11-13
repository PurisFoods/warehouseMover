import { isDevEnv } from './enviornment';

export const getTableData = (
  tableNumber: Number,
  filterField?: Number,
  filterText?: string
) => {
  if (isDevEnv) {
    console.log('Dev Env true');

    const data = {
      field: 'datahere',
    };

    const event = new CustomEvent('BCData', { detail: data });
    console.log(event);
  } else {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [
      tableNumber,
      filterField,
      filterText,
    ]);
  }
};
