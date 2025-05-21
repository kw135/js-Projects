import { app } from "./app";
import tileOperations from "./tileoperations";
export class ImgTile {
    element: HTMLCanvasElement;
    id: number;
    x: number;
    y: number;

    constructor(id: number, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.element = document.createElement("canvas");
        this.element.className = "square";
        this.element.style.backgroundPositionX = -x * 48 - 1 + "px";
        this.element.style.backgroundPositionY = -y * 48 - 1 + "px";
        this.element.setAttribute("id", `item${id}`);

        this.element.onclick = () => this.handleClick();
    }

    handleClick() {
        // console.log(app.selectedTiles, app.previouslySelected, "item");
        const checked = document.getElementById("auto")! as HTMLInputElement;
        const isChecked = checked.checked;
        if (app.selectedTiles.length !== 0) {

            const nextId = Math.max(...app.selectedTiles) + 1;
            app.previouslySelected = app.selectedTiles;
            app.selectedTiles.forEach((id) => {
                const tile = document.getElementById(id.toString());
                if (tile) {
                    tile.className = "tile selected";
                    tile.style.backgroundImage = "url('../img/sprites.png')";
                    tile.style.backgroundPosition = this.element.style.backgroundPosition;

                    if (!app.isControlHeld) {
                        app.selectedTiles = [];
                    }
                    if (isChecked)
                        app.selectedTiles.push(nextId);
                    tile.className = "tile";


                }
            });
            if (app.previouslySelected.length !== 0)
                tileOperations.saveState()
        }
    }
}