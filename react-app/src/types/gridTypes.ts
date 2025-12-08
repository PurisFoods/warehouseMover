export interface Layout {
  layoutId: number;
  layoutName: string;
  totalRows: number;
  totalCols: number;
  grids: GridType[];
}

export interface GridType {
  locationId: number;
  location: string;
  rows: number;
  cols: number;
  stacks: number;
  xPosition: number;
  yPosition: number;
  bayColumn: BayType[];
}

export interface BayType {
  bayId: number;
  bayName: string;
  levels: LevelsType[];
}

export interface LevelsType {
  id: number;
  rowSpan: number;
  colSpan: number;
  level: number;
  bayName: string;
  positions: number;
}
