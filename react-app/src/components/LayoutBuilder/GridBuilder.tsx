import { useState, useEffect } from "react";
import type { GridType, BayType } from "../../types/gridTypes"

interface GridBuilderProps {
    grid: GridType,
    setGrid: Function
}

export const GridBuilder = ({ grid, setGrid }) => {
    const [stackLevel, setStackLevel] = useState(1);
    const [editingCell, setEditingCell] = useState<{ bayIndex: number; levelIndex: number } | null>(null);

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
                bayName: "A",
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

    const handleCellNameChange = (bayIndex: number, levelIndex: number, newName: string) => {
        setGrid(prevState => {
            if (!prevState) return prevState;
            return {
                ...prevState,
                bayColumn: prevState.bayColumn.map((bay, bIdx) =>
                    bIdx === bayIndex
                        ? {
                            ...bay,
                            levels: bay.levels.map((level, lIdx) =>
                                lIdx === levelIndex
                                    ? { ...level, bayName: newName }
                                    : level
                            )
                        }
                        : bay
                )
            };
        });
    };

    useEffect(() => {
        console.log(editingCell);
        console.log(grid?.bayColumn[editingCell.bayIndex].levels[editingCell.levelIndex]);
    }, [editingCell])

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        bayIndex: number,
        levelIndex: number,
        totalBays: number,
        totalLevels: number): void => {


        console.log(e.key);

        if (e.key === 'Enter') {
            e.preventDefault();
            let nextBayIndex: number = bayIndex;
            let nextlevelIndex: number = levelIndex + 1;

            if (nextlevelIndex >= totalLevels) {
                nextlevelIndex = 0;
                nextBayIndex = (bayIndex + 1) % totalBays;
            }

            setEditingCell({ bayIndex: nextBayIndex, levelIndex: nextlevelIndex });

        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                // Move to previous bay, or to end of previous level if on first bay
                let prevBayIndex: number = bayIndex - 1;
                let prevLevelIndex: number = levelIndex;

                console.log('prevBayIndex', prevBayIndex);
                console.log('prevLevelIndex', prevLevelIndex);

                if (prevBayIndex <= 0) {
                    prevBayIndex = totalBays;
                    prevLevelIndex = levelIndex;

                    if (prevLevelIndex <= 0) {
                        prevLevelIndex = totalLevels;
                    }
                }

                setEditingCell({ bayIndex: prevBayIndex, levelIndex: prevLevelIndex });
            } else {
                // Move to next bay, or to start of next level if at end of row
                let nextBayIndex: number = bayIndex + 1;
                let nextLevelIndex: number = levelIndex;

                console.log('nextBayIndex', nextBayIndex);
                console.log('totalBays', totalBays);
                console.log('nextrLevelIndex', nextLevelIndex, typeof nextLevelIndex);
                console.log('totalLevels', totalLevels, typeof totalLevels);

                if (nextBayIndex >= totalBays) {
                    console.log('triggered nextbayIndex > totalBays');
                    nextBayIndex = 0;
                    nextLevelIndex = levelIndex + 1;
                }
                if (nextLevelIndex > totalLevels) {
                    console.log('triggered next level > total')
                    nextLevelIndex = 0;
                }


                setEditingCell({ bayIndex: nextBayIndex, levelIndex: nextLevelIndex });
            }
        }
    };


    return (
        <div>
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
                                <div className='gridHeader'>
                                    {bayItem.bayName}

                                </div>
                                {bayItem.levels.map((bayBox, levelIndex) => (
                                    bayBox.level === stackLevel && (
                                        <div key={bayBox.id} className='bayBox'>
                                            {editingCell?.bayIndex === bayIndex && editingCell?.levelIndex === levelIndex ? (

                                                <input
                                                    id="gridInputBox"
                                                    autoFocus
                                                    value={bayBox.bayName}
                                                    onChange={(e) => handleCellNameChange(bayIndex, levelIndex, e.target.value)}
                                                    // onBlur={() => setEditingCell(null)}
                                                    onKeyDown={(e) => handleKeyDown(
                                                        e,
                                                        bayIndex,
                                                        levelIndex,
                                                        grid.bayColumn.length,
                                                        grid.stacks
                                                    )}
                                                />

                                            ) : (
                                                <div onClick={() => setEditingCell({ bayIndex, levelIndex })}>
                                                    {bayBox.bayName}
                                                </div>
                                            )}
                                        </div>
                                    )
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
            {grid && editingCell &&
                <div className='gridDataControlsContainer'>
                    <label>Bay:</label>
                    <span> {grid.bayColumn[editingCell.bayIndex].bayName} - {grid.bayColumn[editingCell.bayIndex].levels[editingCell.levelIndex].bayName}</span>
                    <br />
                    <label>Positions:</label>
                    <span> {grid.bayColumn[editingCell.bayIndex].levels[editingCell.levelIndex].positions}</span>
                    {/* <input type='text' placeholder={toString()}/> */}
                </div>
            }
        </div>
    )
}