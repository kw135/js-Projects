import { app } from "./app";

export const save = (filename: string,) => {
    const data: string[] = []
    app.mapTiles.forEach(tile => {
        const position = tile.element.style.backgroundPosition == "" ? "0px 0px," : `${tile.element.style.backgroundPosition},`
        data.push(position)
    })
    const blob = new Blob(data, { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click()

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 0)
}

