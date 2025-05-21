import { app } from "./app";
import { save } from "./save";
import { loadFromFile } from "./load";
const tileOperations = {
    history: [] as Array<{ tiles: Array<{ id: string, background: string, className: string }> }>,
    currentState: -1,

    saveState() {
        if (this.currentState < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentState + 1);
        }

        const tilesState = app.mapTiles
            .filter(tile => tile.element.style.backgroundImage || app.selectedTiles.includes(tile.id))
            .map(tile => ({
                id: tile.id.toString(),
                background: tile.element.style.backgroundPosition,
                className: tile.element.className
            }));

        this.history.push({
            tiles: tilesState,
        });

        this.currentState = this.history.length - 1;
        console.log(this.history, "asd", this.currentState)
    },

    applyState(stateIndex: number) {
        if (stateIndex <= -2 || stateIndex >= this.history.length) return;
        const state = this.history[stateIndex];
        app.mapTiles.forEach(tile => {
            tile.element.className = "tile";
            tile.element.style.backgroundImage = "";
            tile.element.style.backgroundPosition = "";
        });
        if (stateIndex !== -1) {
            state.tiles.forEach((tileState: { id: string; background: string; className: string; }) => {
                const tile = document.getElementById(tileState.id);
                if (tile) {
                    if (tileState.background !== "")
                        tile.style.backgroundImage = "url('../img/sprites.png')";
                    tile.className = tileState.className;
                    tile.style.backgroundPosition = tileState.background
                }
            });
        }


        this.currentState = stateIndex;
    },

    delete() {
        app.selectedTiles.forEach(id => {
            const tile = document.getElementById(id.toString());
            if (tile) {
                tile.className = "tile";
                tile.style.backgroundImage = "";
                tile.style.backgroundPosition = "";
            }
        });
        if (!app.isCut)
            this.saveState();
        app.selectedTiles = [];
    },

    copy() {
        app.coppiedTiles = [];
        app.selectedTiles.forEach(id => {
            const tile = document.getElementById(id.toString());
            app.coppiedTiles.push({
                id: id.toString(),
                background: tile.style.backgroundPosition,
                rect: tile.getBoundingClientRect()
            });
        });
        app.previouslySelected = app.selectedTiles;
        app.clearSelection()
        if (app.isCut) {
            this.delete();
            app.isCut = false
        }
        app.selectedTiles = [];
    },

    paste() {
        if (app.coppiedTiles.length !== 0) {
            const firstTile = app.coppiedTiles[0];
            const previewContainer = document.createElement("div");
            previewContainer.className = "copiedDiv";

            const closestTile = (targetX: number, targetY: number) => {
                return app.mapTiles.reduce((prev, current) => {
                    const currentRect = current.element.getBoundingClientRect();
                    const prevRect = prev.element.getBoundingClientRect();
                    const currentDist = Math.sqrt(
                        Math.pow(targetX - currentRect.left, 2) +
                        Math.pow(targetY - currentRect.top, 2)
                    );
                    const prevDist = Math.sqrt(
                        Math.pow(targetX - prevRect.left, 2) +
                        Math.pow(targetY - prevRect.top, 2)
                    );

                    return currentDist <= prevDist ? current : prev;
                });
            };
            let left = 0
            let top = 0
            app.coppiedTiles.forEach(({ background }, index) => {
                const originalRect = app.coppiedTiles[index].rect;
                const newTile = document.createElement("div");
                newTile.className = "tile";
                newTile.style.border = "2px solid green";
                if (background !== "")
                    newTile.style.backgroundImage = "url('../img/sprites.png')";
                newTile.style.backgroundPosition = background;
                newTile.style.position = "absolute";

                const offsetX = originalRect.left - firstTile.rect.left;
                const offsetY = originalRect.top - firstTile.rect.top;
                top = originalRect.top
                left = originalRect.left
                newTile.style.left = `${offsetX}px`;
                newTile.style.top = `${offsetY}px`;
                previewContainer.appendChild(newTile);
            });
            previewContainer.style.left = left + "px"
            previewContainer.style.top = top + "px"
            document.body.appendChild(previewContainer);

            const moveHandler = (e: MouseEvent) => {
                const finalX = e.pageX;
                const finalY = e.pageY;

                const nearestTile = closestTile(finalX, finalY);
                const tileRect = nearestTile.element.getBoundingClientRect();

                previewContainer.style.left = `${tileRect.left + window.scrollX - 3}px`;
                previewContainer.style.top = `${tileRect.top + window.scrollY - 2}px`;
            };

            const upHandler = (e: MouseEvent) => {
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);

                const finalX = e.pageX;
                const finalY = e.pageY;

                app.coppiedTiles.forEach(({ background }, index) => {
                    const originalRect = app.coppiedTiles[index].rect;
                    if (!originalRect) return;

                    const offsetX = originalRect.left - firstTile.rect.left;
                    const offsetY = originalRect.top - firstTile.rect.top;

                    const targetX = finalX + offsetX;
                    const targetY = finalY + offsetY;

                    const nearestTile = closestTile(targetX, targetY);

                    nearestTile.element.style.backgroundImage = "";
                    if (background !== "")
                        nearestTile.element.style.backgroundImage = "url('../img/sprites.png')";
                    nearestTile.element.style.backgroundPosition = background;
                    nearestTile.element.className = "tile selected";

                    if (!app.selectedTiles.includes(nearestTile.id)) {
                        app.selectedTiles.push(nearestTile.id);
                    }
                });

                previewContainer.remove();
            };
            this.saveState()
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        }
    },

    cut() {
        app.isCut = true
        this.copy();
    },

    undo() {
        const index = this.currentState - 1
        if (index == -1) {
            this.applyState(-1);
        } else {
            this.applyState(index)
        }
    },

    redo() {
        if (this.currentState < this.history.length - 1) {
            this.applyState(this.currentState + 1);
        }
    },
    saveMap(e: KeyboardEvent) {
        e.preventDefault()
        save("Map")
    },
    loadMap() {
        loadFromFile()
        this.saveState()
    }
};

export default tileOperations;