export interface TableMetaData {
  company: string;
  primaryKeyFields: string[];
  tableName: string;
  tableNumber: number;
}

export interface TableRecord {
  [key: string]: any;
}

export type RecordsState = [TableMetaData, ...TableRecord[]];
