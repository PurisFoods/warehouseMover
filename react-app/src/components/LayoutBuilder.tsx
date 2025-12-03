import React, { useState, useEffect } from 'react';
import type { BayType, GridType } from '../types/gridTypes';
import { Button } from '@fluentui/react-components';

export const LayoutBuilder: React.FC = () => {
    const [grid, setGrid] = useState<GridType>();
    const [stackLevel, setStackLevel] = useState(2);

    useEffect(() => {
        const data: GridType = {
            "locationId": 1,
            "location": "DAWSON",
            "rows": 7,
            "cols": 33,
            "stacks": 3,
            "xPosition": 1,
            "yPosition": 34,
            "bayColumn": [
                {
                    "bayId": 1,
                    "bayName": "33",
                    "levels": [
                        {
                            "id": 1,
                            "level": 1,
                            "bayName": "A7",
                            "positions": 2
                        },
                        {
                            "id": 2,
                            "level": 1,
                            "bayName": "A6",
                            "positions": 2
                        },
                        {
                            "id": 3,
                            "level": 1,
                            "bayName": "A5",
                            "positions": 2
                        },
                        {
                            "id": 4,
                            "level": 2,
                            "bayName": "B7",
                            "positions": 1
                        }
                    ]
                }
            ]
        }
        setGrid(data);
    }, []);

    const handleAddColumn = () => {
        if (!grid) return;

        const newBay: BayType = {
            bayId: grid.bayColumn.length + 1,
            bayName: String(Number(grid.bayColumn[grid.bayColumn.length - 1].bayName) - 1),
            levels: [...grid.bayColumn[grid.bayColumn.length - 1].levels]
        };

        setGrid(prevState => {
            if (!prevState) return prevState;
            return {
                ...prevState,
                bayColumn: [...prevState.bayColumn, newBay]
            };
        });
    };

    const handleAddRow = (bayIndex: number) => {
        if (!grid) return;

        setGrid(prevState => {
            if (!prevState) return prevState;

            const newLevel = {
                id: Math.max(...prevState.bayColumn.flatMap(b => b.levels.map(l => l.id))) + 1,
                level: stackLevel,
                bayName: "New",
                positions: 2
            };

            return {
                ...prevState,
                bayColumn: prevState.bayColumn.map((bay, index) =>
                    index === bayIndex
                        ? { ...bay, levels: [...bay.levels, newLevel] }
                        : bay
                )
            };
        });
    };

    return (
        <div>
            <div className='gridControls'>
                <Button appearance='primary'>Create Grid</Button>
            </div>
            {grid &&
                <>
                    <div className='gridHeader'>
                        <h6>
                            <pre>
                                Location: {grid.location} ||
                                Position: {grid.xPosition} - {grid.yPosition} ||
                                Stacks: {grid.stacks}
                            </pre>
                        </h6>
                        {Array.from({ length: grid.stacks }).map((_, i) => (
                            <button key={i} onClick={() => setStackLevel(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                    <div className='gridTemplateBox'>
                        {grid.bayColumn.map((bayItem, bayIndex) => (

                            <div className='gridBox' key={bayItem.bayId}>
                                <div className='gridHeader' onClick={() => handleAddColumn()}>
                                    {bayItem.bayName}

                                </div>
                                {bayItem.levels.map((bayBox) => (
                                    bayBox.level == stackLevel &&

                                    <div className='bayBox' key={bayBox.id}>
                                        {bayBox.bayName}
                                    </div>


                                ))}
                                <button onClick={() => handleAddRow(bayIndex)}>+</button>
                            </div>
                        ))}
                        <div className='addColumn'>
                            <button onClick={handleAddColumn}>+Col</button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}