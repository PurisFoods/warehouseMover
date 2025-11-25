import React, { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { RecordsState, TableRecord } from "../types/baseDataTypes";

ModuleRegistry.registerModules([AllCommunityModule]);

interface TableGridProps {
    records: RecordsState
    setRecords: Function
}


export const TableGrid: React.FC<TableGridProps> = ({ records, setRecords }) => {
    const [rows, setRows] = useState<TableRecord[]>();
    const [columns, setColumns] = useState<any>({});

    function sanitizeFieldName(name: string): string {
        return name.replace(/[^a-zA-Z0-9_]/g, '')
    }

    const cleanedRecords = records.slice(1).map((record: any) => {
        const cleaned: any = {}
        Object.keys(record).forEach(key => {
            const cleanKey = sanitizeFieldName(key)
            cleaned[cleanKey] = record[key]
        })
        return cleaned
    })
        ;
    useEffect(() => {
        if (!records || records.length === 0) return;
        const columnDefs = Object.keys(cleanedRecords[0]).map((key: string) => ({
            field: key,
        }));
        const rowParse = cleanedRecords;
        setRows(rowParse);
        setColumns(columnDefs);
    }, [records]);

    return (
        <div className="tableGridContainer" style={{ height: '800px', width: '1000px', border: '1px solid green', margin: '0.5em' }}>
            {columns.length > 0 && rows.length > 0 &&
                <AgGridReact
                    rowData={rows}
                    columnDefs={columns}
                />
            }

        </div>
    )
}