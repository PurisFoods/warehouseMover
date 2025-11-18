import React, { useEffect, useState, type CSSProperties } from "react"
import { DataGrid, DataGridBody, DataGridRow, DataGridHeader, DataGridHeaderCell, DataGridCell, createTableColumn, TableHeader, TableHeaderCell } from "@fluentui/react-components"
import { getTableData } from "../modules/bcCalls"

import type { SimpleRecord } from "../modules/bcTransformer";

interface binContentProps {
    records: SimpleRecord[],
    setRecords: Function
}

interface GridSet {
    rows: Number,
    columns: Number,
    levels: Number
}

export const BinContent: React.FC<binContentProps> = ({ records, setRecords }) => {

    const [bincodes, setBinCodes] = useState<string[]>();
    const [warehouseGrid, setWarehouseGrid] = useState<CSSProperties>();
    const [gridSet, setGridSet] = useState<GridSet[]>([{ rows: 14, columns: 20, levels: 3 }]);

    useEffect(() => {
        getTableData(7302, 500, "Location Code", "DAWSON");
        // setRecords(getTableData(7302, 500));
        console.log('bincontentrecords', records);

        setWarehouseGrid({
            ...warehouseGrid,
            display: 'grid',
            gridTemplateColumns: gridSet[0].columns.toString(),
            gridTemplateRows: gridSet[0].rows.toString(),
            gridColumn: '2 / span 10',
            gridRow: '2 / span 10',
            rowGap: '0'
        });
    }, []);

    useEffect(() => {
        const uniqueBinCodes = Array.from(
            new Set(records.map((rec) => rec["Bin Code"]))
        );
        if (records) {
            setBinCodes(uniqueBinCodes);
        }
    }, [records]);

    useEffect(() => {
        console.log('bincodes', bincodes);
    }, [bincodes]);


    return (
        <div className='layoutContainer' style={{ width: "100%", overflowX: "auto" }}>
            <div className="gridContainer">
                <div className="warehouseGrid" style={warehouseGrid}>
                    {gridSet.map((item, i) => (
                        <React.Fragment key={i}>
                            {Array.from({ length: Number(item.rows) }).map((_, row) =>
                                Array.from({ length: Number(item.columns) }).map((_, col) => (
                                    <div
                                        key={`r${row}-c${col}`}
                                        id={`cell-r${row}-c${col}`}
                                        style={{
                                            gridColumn: col + 1,
                                            gridRow: row + 1,
                                            border: "0.01em solid rgba(200,200,200, 0.5)",
                                            width: '40px',
                                            height: '40px',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>{col}-{row}</span>
                                    </div>
                                ))
                            )}
                        </React.Fragment>
                    ))}
                </div>

            </div>

        </div>
    )
}