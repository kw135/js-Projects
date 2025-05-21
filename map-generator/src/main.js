var ImgTile = /** @class */ (function () {
    function ImgTile(id, x, y) {
        var _this = this;
        this.id = id;
        this.x = x;
        this.y = y;
        this.element = document.createElement("canvas");
        this.element.className = "square";
        this.element.style.backgroundPositionX = -x * 48 - 1 + "px";
        this.element.style.backgroundPositionY = -y * 48 - 1 + "px";
        this.element.setAttribute("id", "item".concat(id));
        this.element.onclick = function () { return _this.handleClick(); };
    }
    ImgTile.prototype.handleClick = function () {
        var _this = this;
        console.log(app.selectedTiles, app.previouslySelected, "item");
        var checked = document.getElementById("auto");
        var isChecked = checked.checked;
        if (app.selectedTiles.length !== 0) {
            app.previouslySelected.forEach(function (id) {
                var prevTile = document.getElementById(id.toString());
                if (prevTile) {
                    prevTile.className = "tile";
                }
            });
            var nextId_1 = Math.max.apply(Math, app.selectedTiles) + 1;
            app.previouslySelected = app.selectedTiles;
            app.selectedTiles.forEach(function (id) {
                var tile = document.getElementById(id.toString());
                if (tile) {
                    tile.className = "tile selected";
                    tile.style.backgroundImage = "url('../img/sprites.png')";
                    tile.style.backgroundPosition = _this.element.style.backgroundPosition;
                    if (!app.isControlHeld) {
                        app.selectedTiles = [];
                    }
                    if (isChecked) {
                        app.selectedTiles.push(nextId_1);
                    }
                    else {
                        tile.className = "tile";
                    }
                }
            });
        }
    };
    return ImgTile;
}());
var MapTile = /** @class */ (function () {
    function MapTile(id, x, y) {
        var _this = this;
        this.id = id;
        this.x = x;
        this.y = y;
        this.element = document.createElement("canvas");
        this.element.className = "tile";
        this.position = this.element.getBoundingClientRect();
        this.element.setAttribute("id", id.toString());
        this.element.onclick = function () { return _this.handleClick(); };
    }
    MapTile.prototype.handleClick = function () {
        app.selectedTiles.sort();
        console.log(app.selectedTiles, app.previouslySelected);
        console.log(this.position);
        if (!app.isControlHeld) {
            app.previouslySelected = app.selectedTiles;
            app.selectedTiles = [];
        }
        if (app.selectedTiles.includes(this.id)) {
            app.selectedTiles.splice(app.selectedTiles.indexOf(this.id), 1);
            this.element.className = "tile";
        }
        else {
            this.element.className = "tile selected";
            app.selectedTiles.push(this.id);
        }
        app.previouslySelected.forEach(function (id) {
            var prevTile = document.getElementById(id.toString());
            if (prevTile) {
                prevTile.className = "tile";
            }
        });
        this.setupKeyListeners();
    };
    MapTile.prototype.updatePosition = function () {
        this.position = this.element.getBoundingClientRect();
    };
    MapTile.prototype.setupKeyListeners = function () {
        window.addEventListener("keydown", function (e) {
            if (app.selectedTiles.length !== 0) {
                switch (e.key) {
                    case "Delete":
                        app.selectedTiles.forEach(function (id) {
                            var tile = document.getElementById(id.toString());
                            if (tile) {
                                tile.className = "tile";
                                tile.style.backgroundImage = "";
                                tile.style.backgroundPosition = "";
                            }
                        });
                        app.selectedTiles = [];
                        break;
                    case "Meta":
                    case "Control":
                        app.isControlHeld = true;
                        break;
                    default:
                        break;
                }
            }
        });
        window.addEventListener("keyup", function (e) {
            switch (e.key) {
                case "Meta":
                case "Control":
                    app.isControlHeld = false;
                    break;
                default:
                    break;
            }
        });
    };
    return MapTile;
}());
var app = {
    sizeX: 16,
    sizeY: 20,
    sizeY2: 20,
    sizeX2: 29,
    selectedTiles: [],
    previouslySelected: [],
    isControlHeld: false,
    mapTiles: []
};
window.addEventListener("load", function () {
    var itemsCanvas = document.getElementById("itemsCanvas");
    var count = 0;
    for (var y = 0; y < app.sizeY; y++) {
        for (var x = 0; x < app.sizeX; x++) {
            var imgTile = new ImgTile(count, x, y);
            itemsCanvas === null || itemsCanvas === void 0 ? void 0 : itemsCanvas.appendChild(imgTile.element);
            count++;
        }
    }
    var mainCanvas = document.getElementById("mainCanvas");
    count = 0;
    for (var y = 0; y < app.sizeY2; y++) {
        for (var x = 0; x < app.sizeX2; x++) {
            var mapTile = new MapTile(count, x, y);
            app.mapTiles.push(mapTile);
            mainCanvas === null || mainCanvas === void 0 ? void 0 : mainCanvas.appendChild(mapTile.element);
            mapTile.updatePosition();
            count++;
        }
    }
    mainCanvas === null || mainCanvas === void 0 ? void 0 : mainCanvas.addEventListener("mousedown", function (f) {
        var startingPoint = { x: f.pageX, y: f.pageY };
        var handleMouseMove = function (e) {
            var div = document.createElement("div");
            div.setAttribute("id", "yellow");
            var divs = document.querySelectorAll("#yellow");
            div.style.backgroundColor = "rgba(255,255,0,0.5)";
            div.style.position = "absolute";
            if (e.pageX - startingPoint.x > 0) {
                div.style.left = startingPoint.x + "px";
                div.style.width = e.pageX - startingPoint.x + "px";
            }
            else {
                div.style.left = e.pageX + "px";
                div.style.width = startingPoint.x - e.pageX + "px";
            }
            if (e.pageY - startingPoint.y > 0) {
                div.style.top = startingPoint.y + "px";
                div.style.height = e.pageY - startingPoint.y + "px";
            }
            else {
                div.style.top = e.pageY + "px";
                div.style.height = startingPoint.y - e.pageY + "px";
            }
            mainCanvas.append(div);
            var position = div.getBoundingClientRect();
            app.mapTiles.forEach(function (tile) {
                if (tile.position.left < position.right &&
                    tile.position.right > position.left &&
                    tile.position.top < position.bottom &&
                    tile.position.bottom > position.top) {
                    // Only select if not already selected
                    if (!app.selectedTiles.includes(tile.id)) {
                        tile.element.className = "tile selected";
                        app.selectedTiles.push(tile.id);
                    }
                }
                else if (!app.isControlHeld) {
                    // Deselect if not in selection area (unless control is held)
                    var index = app.selectedTiles.indexOf(tile.id);
                    if (index > -1) {
                        app.selectedTiles.splice(index, 1);
                        tile.element.className = "tile";
                    }
                }
            });
            divs.forEach(function (el) { return el.remove(); });
        };
        var cleanup = function () {
            var div = document.getElementById("yellow");
            if (div && !app.isControlHeld) {
                div.remove();
            }
            mainCanvas.removeEventListener("mousemove", handleMouseMove);
        };
        mainCanvas.addEventListener("mousemove", handleMouseMove);
        mainCanvas.addEventListener("mouseleave", cleanup);
        mainCanvas.addEventListener("mouseup", cleanup);
    });
});
