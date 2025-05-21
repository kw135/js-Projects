import { app } from "./app";

export interface PosiotionType {
    x: number,
    y: number,
    height: number,
    width: number,
    top: number,
    right: number,
    bottom: number,
    left: number
}
export class MapTile {
    element: HTMLCanvasElement;
    id: number;
    x: number;
    y: number;
    position: PosiotionType;
    constructor(id: number, x: number, y: number,) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.element = document.createElement("canvas");
        this.element.className = "tile";
        this.position = this.element.getBoundingClientRect()
        this.element.setAttribute("id", id.toString());
        this.element.onclick = (e) => this.handleClick(e);
    }

    handleClick(e: any) {
        app.selectedTiles.sort();
        if (!app.isControlHeld) {
            app.previouslySelected = app.selectedTiles;
            app.selectedTiles = [];
        }
        this.element.className = "tile selected";
        if (app.selectedTiles.includes(this.id)) {
            app.selectedTiles.splice(app.selectedTiles.indexOf(this.id), 1);
            this.element.className = "tile";
        } else {
            app.selectedTiles.push(this.id);
        }
        app.clearSelection()
    }
    updatePosition() {
        this.position = this.element.getBoundingClientRect();
    }

}