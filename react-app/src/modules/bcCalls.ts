import { isDevEnv } from './enviornment';

export const getTableData = (
  tableNumber: Number,
  filterField?: Number,
  filterText?: string
) => {
  if (isDevEnv) {
  } else {
    Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod('GetTable', [
      tableNumber,
      filterField,
      filterText,
    ]);
  }
};
