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
  level: number;
  bayName: string;
  positions: number;
}
