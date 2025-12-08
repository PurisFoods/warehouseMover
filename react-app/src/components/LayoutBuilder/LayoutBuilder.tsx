import React, { useState, useEffect } from 'react';
import type { BayType, GridType } from '../../types/gridTypes';
import { Button } from '@fluentui/react-components';
import { GridBuilder } from './GridBuilder';

export const LayoutBuilder: React.FC = () => {
    const [grid, setGrid] = useState<GridType>();


    return (
        <div>
            <div className='gridControls'>
                <Button appearance='primary'>Create Grid</Button>
            </div>
            <GridBuilder grid={grid} setGrid={setGrid} />
        </div >
    );
}