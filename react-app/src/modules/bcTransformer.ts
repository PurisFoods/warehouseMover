// BC Record Types
export interface BCField {
  id: number;
  name: string;
  type: string;
  value: any;
}

export interface BCPrimaryKey {
  fieldCount: number;
  fields: BCField[];
}

export interface BCRecord {
  id: number;
  name: string;
  company: string;
  position: string;
  recordId: string;
  primaryKey: BCPrimaryKey;
  fields: BCField[];
}

export interface SimpleRecord {
  recordLine: number;
  tableName: string;
  company: string;
  recordId: string;
  [key: string]: any;
}

// Helper: convert to camelCase
function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/\s+/g, '');
}

// Transform BC's complex structure to simple flat object
export function flattenBCRecord(bcRecord: BCRecord): SimpleRecord {
  const flattened: SimpleRecord = {
    recordLine: bcRecord.primaryKey.fields[0].value,
    tableName: bcRecord.name,
    company: bcRecord.company,
    recordId: bcRecord.recordId
  };

  // Add all fields as top-level properties (camelCase for easier React use)
  bcRecord.fields.forEach(field => {
    flattened[toCamelCase(field.name)] = field.value;
  });

  return flattened;
}

// Transform array of BC records
export function flattenBCRecords(bcRecords: BCRecord[]): SimpleRecord[] {
  return bcRecords.map(flattenBCRecord);
}

// Convert BC record back to complex structure for sending to BC
export function unflattenToBCRecord(
  simpleRecord: SimpleRecord,
  originalBCRecord: BCRecord
): BCRecord {
  const unflatted: BCRecord = {
    ...originalBCRecord,
    fields: originalBCRecord.fields.map(field => ({
      ...field,
      value: simpleRecord[toCamelCase(field.name)] ?? field.value
    }))
  };

  return unflatted;
}

// Convert array of simple records back to BC format
export function unflattenToBCRecords(
  simpleRecords: SimpleRecord[],
  originalBCRecords: BCRecord[]
): BCRecord[] {
  return simpleRecords.map((simpleRecord, index) =>
    unflattenToBCRecord(simpleRecord, originalBCRecords[index] || originalBCRecords[0])
  );
}

// Parse BC JSON string and return flattened records
export function parseBCJson(jsonString: string): SimpleRecord[] {
  try {
    const bcRecords: BCRecord[] = JSON.parse(jsonString);
    return flattenBCRecords(bcRecords);
  } catch (error) {
    console.error('Error parsing BC JSON:', error);
    return [];
  }
}

// Convert simple records back to BC JSON string
export function serializeToBCJson(
  simpleRecords: SimpleRecord[],
  originalBCRecords: BCRecord[]
): string {
  try {
    const bcRecords = unflattenToBCRecords(simpleRecords, originalBCRecords);
    return JSON.stringify(bcRecords);
  } catch (error) {
    console.error('Error serializing to BC JSON:', error);
    return '[]';
  }
}