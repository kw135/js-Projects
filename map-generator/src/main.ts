import { app } from "./app";
import { MapTile } from "./mapTile";
import { ImgTile } from "./imgTile";
import { save } from "./save";
import { loadFromFile } from "./load";
import tileOperations from "./tileoperations";
import { setupKeyListeners } from "./setUpListeners";

window.addEventListener("load", function () {
    const dialog = document.getElementById("contextMenu") as HTMLDialogElement
    const functions = [() => { tileOperations.undo(); dialog.close() }, () => { tileOperations.redo(); dialog.close() }, () => { tileOperations.cut(); dialog.close() }, () => { tileOperations.copy(); dialog.close() }, () => { tileOperations.paste(); dialog.close() }, () => { tileOperations.delete(); dialog.close() }, () => { save("map",); dialog.close() }, () => { loadFromFile(); dialog.close() }]
    for (let i = 0; i < dialog.children.length; i++) {
        dialog.children[i].addEventListener("click", functions[i])
    }
    const itemsCanvas = document.getElementById("itemsCanvas");
    let count = 0;
    for (let y = 0; y < app.sizeY; y++) {
        for (let x = 0; x < app.sizeX; x++) {
            const imgTile = new ImgTile(count, x, y);
            itemsCanvas?.appendChild(imgTile.element);
            count++;
        }
    }
    const mainCanvas = document.getElementById("mainCanvas");
    count = 0;
    for (let y = 0; y < app.sizeY2; y++) {
        for (let x = 0; x < app.sizeX2; x++) {
            const mapTile = new MapTile(count, x, y);
            app.mapTiles.push(mapTile)
            mainCanvas?.appendChild(mapTile.element);
            mapTile.updatePosition()
            count++;
        }
    }
    setupKeyListeners()
    window.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        dialog.style.left = (e.pageX) + "px";
        dialog.style.top = (e.pageY) + "px";
        dialog.showModal();
        window.addEventListener("click", function () {
            dialog.close()
        })
    });
    mainCanvas?.addEventListener("mousedown", function (f) {
        const startingPoint = {
            x: f.clientX + mainCanvas.scrollLeft,
            y: f.clientY + mainCanvas.scrollTop
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!app.isControlHeld) {
                app.selectedTiles.forEach(id => {
                    const tile = document.getElementById(id.toString());
                    if (tile) tile.className = "tile";
                });
                app.selectedTiles = [];
            }

            const div = document.getElementById("yellow") || document.createElement("div");
            if (!div.id) {
                div.setAttribute("id", "yellow");
                div.style.backgroundColor = "rgba(255,255,0,0.5)";
                div.style.position = "absolute";
                div.style.pointerEvents = "none";
                div.style.zIndex = "1000";
                mainCanvas.appendChild(div);
            }

            const scrollX = mainCanvas.scrollLeft;
            const scrollY = mainCanvas.scrollTop;
            const currentX = e.clientX + scrollX;
            const currentY = e.clientY + scrollY;

            const left = Math.min(startingPoint.x, currentX);
            const top = Math.min(startingPoint.y, currentY);
            const width = Math.abs(currentX - startingPoint.x);
            const height = Math.abs(currentY - startingPoint.y);

            div.style.left = `${left - scrollX}px`;
            div.style.top = `${top - scrollY}px`;
            div.style.width = `${width}px`;
            div.style.height = `${height}px`;

            app.mapTiles.forEach(tile => {
                const tileRect = {
                    left: tile.position.left,
                    top: tile.position.top,
                    right: tile.position.left + tile.position.width,
                    bottom: tile.position.top + tile.position.height
                };

                const isIntersecting =
                    tileRect.right > left &&
                    tileRect.left < left + width &&
                    tileRect.bottom > top &&
                    tileRect.top < top + height;

                if (isIntersecting) {
                    if (!app.selectedTiles.includes(tile.id)) {
                        tile.element.className = "tile selected";
                        app.selectedTiles.push(tile.id);
                    }
                } else if (!app.isControlHeld) {
                    const index = app.selectedTiles.indexOf(tile.id);
                    if (index > -1) {
                        app.selectedTiles.splice(index, 1);
                        tile.element.className = "tile";
                    }
                }
            });
        };

        const cleanup = () => {
            const div = document.getElementById("yellow");
            if (div) div.remove();
            mainCanvas.removeEventListener("mousemove", handleMouseMove);
            mainCanvas.removeEventListener("scroll", handleMouseMove)
            mainCanvas.removeEventListener("mouseleave", cleanup);
            mainCanvas.removeEventListener("mouseup", cleanup);
        };

        mainCanvas.addEventListener("mousemove", handleMouseMove);
        mainCanvas.addEventListener("scroll", handleMouseMove)
        mainCanvas.addEventListener("mouseleave", cleanup);
        mainCanvas.addEventListener("mouseup", cleanup);
    });
});