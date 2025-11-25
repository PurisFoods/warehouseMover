import React, { useEffect, useState, useRef } from "react";
import {
    AllCommunityModule, ModuleRegistry
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { lightBase, darkBase } from "../modules/agThemes";
import type { RecordsState, TableRecord } from "../types/baseDataTypes";
import type { CellValueChangedEvent } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface TableGridProps {
    records: RecordsState
    setRecords: Function
}


export const TableGrid: React.FC<TableGridProps> = ({ records, setRecords }) => {
    const [rows, setRows] = useState<TableRecord[]>();
    const [columns, setColumns] = useState<any>({});
    const gridRef = useRef<AgGridReact>(null);

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
            filter: true,
            editable: true
        }));
        const rowParse = cleanedRecords;
        setRows(rowParse);
        setColumns(columnDefs);
    }, [records]);

    const handleCellEditing = (e: CellValueChangedEvent<TableRecord>) => {
        console.log(records[0]);
        console.log('e.colDef.field', e.colDef.field);
        console.log('e.data', e.data);
    }

    const handleUndo = () => {
        gridRef.current?.api?.undoCellEditing();
    };

    const handleRedo = () => {
        gridRef.current?.api?.redoCellEditing();
    }

    return (
        <div className="tableGridContainer" style={{ height: '800px', width: '1000px' }}>

            <div className="controlsContainer">
                <div className='tableControls' style={{ marginBottom: '10px' }}>
                    <div>
                        <button onClick={handleUndo}>Undo</button>
                    </div>
                    <div>
                        <button onClick={handleRedo}>Redo</button>
                    </div>
                </div>
            </div>
            {columns.length > 0 && rows.length > 0 &&
                <AgGridReact
                    theme={lightBase}
                    ref={gridRef}
                    rowData={rows}
                    columnDefs={columns}
                    rowSelection={{ mode: "multiRow" }}
                    onCellValueChanged={handleCellEditing}
                    rowDragEntireRow={true}
                    rowDragManaged={true}
                    rowDragMultiRow={true}
                    undoRedoCellEditing={true}
                    undoRedoCellEditingLimit={20}
                />
            }

        </div>
    )
}