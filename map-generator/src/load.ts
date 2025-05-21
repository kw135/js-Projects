import { app } from "./app"
export const loadFromFile = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.click()
    fileInput.addEventListener("change", function (e) {
        load(e.target as HTMLInputElement)
    })
}


const load = (files?: HTMLInputElement) => {
    console.log(files.files);
    const file = files.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        const data = reader.result as string;
        const dataArray = data.split(",")
        app.mapTiles.forEach((tile, i) => {
            tile.element.style.backgroundPosition = ""
            tile.element.style.backgroundImage = "";
            if (dataArray[i] != "0px 0px") {
                tile.element.style.backgroundPosition = dataArray[i]
                tile.element.style.backgroundImage = "url('../img/sprites.png')";
            }
        })
    }
}