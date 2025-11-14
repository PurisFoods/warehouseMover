import React, { useEffect, useMemo } from "react"
import { DataGrid, DataGridBody, DataGridRow, DataGridHeader, DataGridHeaderCell, DataGridCell, createTableColumn, TableHeader, TableHeaderCell } from "@fluentui/react-components"
import { getTableData } from "../modules/bcCalls"

import type { SimpleRecord } from "../modules/bcTransformer";

interface binContentProps {
    records: SimpleRecord[],
    setRecords: Function
}

export const BinContent: React.FC<binContentProps> = ({ records, setRecords }) => {

    useEffect(() => {
        // getTableData(7302, 500);
        setRecords(getTableData(7302, 500));
        console.log('bincontentrecords', records);
    }, [])

    const columns = useMemo(() => {
        if (records.length === 0) return []

        return records[0].fields.map(field =>
            createTableColumn({
                columnId: field.name,
                renderHeaderCell: () => field.name,
                renderCell: (item: any) => {
                    const fieldValue = item.fields.find(f => f.name === field.name)?.value
                    return String(fieldValue ?? "-")
                }
            })
        )
    }, [records])

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <table>
                <TableHeader>
                    {records.map((field) => (
                        <TableHeaderCell>{field}</TableHeaderCell>
                    ))}
                </TableHeader>
            </table>
        </div>
    )
}