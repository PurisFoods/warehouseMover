export interface GridType {
    "locationId": number,
    "location": string,
    "grid": BayType[]
}

export interface BayType {
    "bayId": number,
    "bayName": string,
    "startRow": number,
    "startColumn": number,
    "rowSpan": number,
    "colSpan": number,
    "levels": LevelsType[]
}

export interface LevelsType {
    "id": number,
    "level": number,
    "bayLevelName": string,
    "positions": number
}