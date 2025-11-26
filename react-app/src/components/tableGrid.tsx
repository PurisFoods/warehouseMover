import React, { useEffect, useState, useRef } from "react";
import {
    AllCommunityModule, ModuleRegistry
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { lightBase, darkBase } from "../modules/agThemes";
import type { RecordsState, TableRecord } from "../types/baseDataTypes";
import type { CellValueChangedEvent } from "ag-grid-community";
import { updateRow } from "../modules/bcCalls";


ModuleRegistry.registerModules([AllCommunityModule]);

interface TableGridProps {
    records: RecordsState
    setRecords: Function
}


export const TableGrid: React.FC<TableGridProps> = ({ records, setRecords }) => {
    const [rows, setRows] = useState<TableRecord[]>();
    const [columns, setColumns] = useState<any>({});
    const gridRef = useRef<AgGridReact>(null);

    // console.log('Records Prop', records);
    // console.log('Records prop length', records?.length);

    function sanitizeFieldName(name: string): string {
        return name.replace(/[^a-zA-Z0-9_]/g, '');
    }

    useEffect(() => {
        console.log('useEffect in grid component called');
        if (!records || records.length === 0) {
            console.log('records return', records?.length);
            return;
        }
        
        console.log('Processing records');

        const cleanedRecords = records.slice(1).map((record: any) => {
            const cleaned: any = {}
            Object.keys(record).forEach(key => {
                const cleanKey = sanitizeFieldName(key)
                cleaned[cleanKey] = record[key]
            })
            return cleaned
        });

        console.log('cleanedRecords:', cleanedRecords);

        if (cleanedRecords.length === 0) {
            console.log('cleanedRecords is empty');
            return;
        }

        const columnDefs = Object.keys(cleanedRecords[0]).map((key: string) => ({
            field: key,
            filter: true,
            editable: true,
        }));

        console.log('rowParse and cleaned records calls', cleanedRecords);
        setRows(cleanedRecords);
        setColumns(columnDefs);
    }, [records]); 

    useEffect(() => {
    const handleResize = () => {
        gridRef.current?.api?.sizeColumnsToFit();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

const handleCellEditing = (e: CellValueChangedEvent<TableRecord>) => {
    console.log('records[0]', records[0]);
    console.log('e.colDef.field', e.colDef.field);
    console.log('e.data', e.data);
    
    const primaryKeyFields = records[0].primaryKeyFields; // ['Document Type', 'Document No.', 'Line No.']
    
    setRecords((prevRecords: RecordsState) => 
        prevRecords.map((record: TableRecord, index: number) => {
            // Skip the metadata row (index 0)
            if (index === 0) return record;
            
            // Check if this record matches based on all primary key fields
            const isMatch = primaryKeyFields.every((pkField: string) => {
                const sanitizedPkField = sanitizeFieldName(pkField);
                return record[sanitizedPkField] === e.data[sanitizedPkField];
            });
            
            return isMatch ? { ...record, ...e.data } : record;
        })
    );
    updateRow(records[0], e.data);
    
}

    const handleUndo = () => {
        gridRef.current?.api?.undoCellEditing();
    };

    const handleRedo = () => {
        gridRef.current?.api?.redoCellEditing();
    }

    if (!columns.length || !rows.length) {
        return null;
    }

    return (
        <div className="tableGridContainer" style={{ height: '600px', width: '800px' }}>

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
                    

                    suppressAnimationFrame={true}
                    suppressColumnVirtualisation={true}
                    suppressRowVirtualisation={true}
                    suppressModelUpdateAfterUpdateTransaction={true}
                    />
            }

        </div>
    )
}