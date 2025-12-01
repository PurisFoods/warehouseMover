import React, { useState, useEffect } from 'react';

import type { GridType } from '../types/gridTypes';

export const LayoutBuilder: React.FC = () => {
    const [grid, setGrid] = useState<GridType[]>();

    useEffect(() => {
        const data: GridType = {
            "locationId": 1,
            "location": "DAWSON",
            "grid": [
                {
                    "bayId": 1,
                    "gridName": "grid1",
                    "rows": 7,
                    "columns": 33,
                    "xPosition": 1,
                    "yPosition": 1,
                    "bays": [
                        {
                            "bayId": 1,
                            "bayName": "33",
                            "startRow": 1,
                            "startColumn": 1,
                            "rowSpan": 1,
                            "colSpan": 1,
                            "levels": [
                                {
                                    "id": 1,
                                    "level": 1,
                                    "bayLevelName": "C",
                                    "positions": 2
                                },
                                {
                                    "id": 2,
                                    "level": 2,
                                    "bayLevelName": "B",
                                    "positions": 1
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    },[])

    return (
        <div>
            <div className='gridTemplateBox'>
                {grid.map((item) => (
                    <table>
                        <thead></thead>
                        {item.grid.map((subGrid) => (
                            <th>{subGrid.gridName}</th>

                            
                        
                        ))
                        
                            
                        </tr>
                    </table>
                ))}
            </div>

        </div>
    );
}