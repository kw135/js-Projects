import { MapTile } from "./mapTile";
export interface AppTypes {
    sizeX: number;
    sizeY: number;
    sizeX2: number;
    sizeY2: number;
    selectedTiles: number[];
    previouslySelected: number[];
    isControlHeld: boolean;
    isCut: boolean,
    mapTiles: MapTile[];
    coppiedTiles: { id: string, background: string, rect: DOMRect }[]
    clearSelection: () => void
}

export const app: AppTypes = {
    sizeX: 16,
    sizeY: 20,
    sizeY2: 40,
    sizeX2: 29,
    selectedTiles: [],
    previouslySelected: [],
    isControlHeld: false,
    isCut: false,
    mapTiles: [],
    coppiedTiles: [],
    clearSelection: () => {
        app.previouslySelected.forEach(id => {
            const prevTile = document.getElementById(id.toString());
            if (prevTile) {
                prevTile.className = "tile";
            }
        });
    }
};
