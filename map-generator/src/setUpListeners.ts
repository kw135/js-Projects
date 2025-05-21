import { app } from "./app";
import tileOperations from "./tileoperations";
export const setupKeyListeners = () => {
    window.addEventListener("keydown", (e) => {
        if (app.selectedTiles) {
            console.log(e.key)
            switch (e.key) {
                case "Delete":
                    tileOperations.delete()
                    break;
                case "Meta":
                case "Control":
                    app.isControlHeld = true;
                    break;
                case "c":
                    if (app.isControlHeld)
                        tileOperations.copy()
                    break
                case "v":
                    if (app.isControlHeld)
                        tileOperations.paste()
                    break;
                case "x":
                    if (app.isControlHeld)
                        tileOperations.cut()
                    break
                case "z":
                    if (app.isControlHeld)
                        tileOperations.undo()
                    break;
                case "y":
                    if (app.isControlHeld)
                        tileOperations.redo()
                    break;
                case "s":
                    e.preventDefault();
                    if (app.isControlHeld)
                        tileOperations.saveMap(e)
                    break;
                case "l":
                    if (app.isControlHeld)
                        tileOperations.loadMap()
                    break;
                default:
                    break;
            }

        }
    });
    window.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "Meta":
            case "Control":
                app.isControlHeld = false;
                break;
            default:
                break;
        }
    });
}