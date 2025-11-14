import { isDevEnv } from './enviornment';

export const getTableData = (
  tableNumber: Number,
  filterField?: Number,
  filterText?: string
) => {
  if (isDevEnv()) {
    console.log('Dev Env true');

    const data = {
      field: 'datahere',
    };

    const event = new CustomEvent('BCData', { detail: data });
    console.log(event);
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
