import { displaySettings } from "./settings.js";
import setDifficulty from "./setDifficulty.js";
import createTrack from "./createTrack.js";
import showScore from "./showScore.js";
const numberOfPlayers = document.getElementById('numberOfPlayers');
const difficulty = document.getElementById('difficulty');
const numberOfLaps = document.getElementById('numberOfLaps');
window.addEventListener("load", () => { displaySettings(), createTrack() });
numberOfPlayers.addEventListener('change', displaySettings);
export const game = {
    playerSpeed: 15,
    interval: null,
    players: [],
    canvas: document.getElementById("mainCanvas"),
    colors: ["rgba(255,0,0,", "rgba(255,0,255,", "rgba(0,0,255,", "rgba(255,255,0,"],
    winningLaps: 2,
    showWinnerPopup(winnerNumber) {
        const winPopup = document.getElementById('winPopup');
        const winnerMessage = document.getElementById('winnerMessage');
        winnerMessage.textContent = `${winnerNumber}`;
        winPopup.style.display = 'flex';
    },
    movePlayer() {
        this.players.forEach(player => {
            player.movePlayer()
            player.drawTrail()
            player.drawPlayer();
        });
    },
    isOnTrack(player) {
        const cxLeft = 200, cy = 200;
        const cxRight = 800;
        const R_outer = 199;
        const dLeft = Math.sqrt((player.x - cxLeft) ** 2 + (player.y - cy) ** 2);
        const dRight = Math.sqrt((player.x - cxRight) ** 2 + (player.y - cy) ** 2);
        const inOuterCircle = dLeft <= R_outer || dRight <= R_outer;
        const inStraightPart = player.x > cxLeft && player.x < cxRight &&
            player.y > (cy - R_outer) && player.y < (cy + R_outer);
        return inOuterCircle || inStraightPart;
    },
    isOnGrass(player) {
        const cxLeft = 250, cy = 200;
        const cxRight = 750;
        const R_inner = 50;
        const dLeft = Math.sqrt((player.x - cxLeft) ** 2 + (player.y - cy) ** 2);
        const dRight = Math.sqrt((player.x - cxRight) ** 2 + (player.y - cy) ** 2);
        const inInnerCircle = dLeft < R_inner || dRight < R_inner;
        const inHorizontalGrass = player.x > 250 && player.x < 750 &&
            player.y > 150 && player.y < 250;

        return inInnerCircle || inHorizontalGrass;
    },
    isGameOn() {
        return this.players.some((player) => player.live == true)
    },
    startGame() {
        createTrack();
        this.players = []
        if (this.interval) {
            clearInterval(this.interval);
        }
        const keys = []
        for (let i = 0; i < numberOfPlayers.value; i++) {
            keys.push(document.getElementById(`player${i + 1}`).value.toLowerCase());
        }
        const playersArray = this.players
        for (let i = 0; i < numberOfPlayers.value; i++) {
            playersArray.push(new Player());
            window.addEventListener("keydown", function (e) {
                if (e.key === keys[i]) {
                    playersArray[i].turn = true;
                }
            })
            window.addEventListener("keyup", function (e) {
                if (e.key === keys[i]) {
                    playersArray[i].turn = false;
                }
            })
        }
        playersArray.forEach((player, i) => {
            player.y += 25 * i
            player.color = this.colors[i]
        })
        this.interval = setInterval(() => {
            createTrack();
            this.movePlayer();
            showScore()
            if (!this.isGameOn()) {
                this.showWinnerPopup("Nikt nie wygrywa");
                clearInterval(this.interval);
            }
        }, 40);
    },
};
class Player {
    x;
    y;
    angle;
    turn;
    ctx;
    color;
    trail;
    laps;
    live;
    img;

    constructor() {
        this.x = 500;
        this.y = 275;
        this.ctx = game.canvas.getContext("2d");
        this.angle = Math.PI / 2;
        this.trail = [];
        this.laps = { number: 0, counter: 0 };
        this.live = true;
        this.img = new Image();
        this.img.src = "./img/motorcycle.png"
    }

    movePlayer() {
        if (game.isOnTrack({ x: this.x, y: this.y }) && !game.isOnGrass({ x: this.x, y: this.y })) {
            this.laps.counter++;
            if (this.turn)
                this.angle += Math.PI / 240 * game.playerSpeed;
            const dx = game.playerSpeed * Math.sin(this.angle);
            const dy = game.playerSpeed * Math.cos(this.angle);
            this.x += dx;
            this.y += dy;
            if (this.x >= 501 - game.playerSpeed && this.x <= 499 + game.playerSpeed & this.laps.counter >= 10) {
                this.laps.counter = 0;
                this.laps.number++;
            }
            if (this.laps.number == game.winningLaps * 2) {
                clearInterval(game.interval);
                isGameStarted = false;
                game.showWinnerPopup(`Gracz ${game.players.indexOf(this) + 1} wygrywa!`);
            }
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 20) {
                this.trail.shift();
            }
        } else {
            this.live = false;
            isGameStarted = false;
        }
    }

    drawPlayer() {
        if (!this.img.complete) return;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(Math.PI - this.angle);
        this.ctx.drawImage(
            this.img,
            -40,
            -30,
            80, 80
        );
        this.ctx.restore();
    }

    drawTrail() {
        for (let i = 1; i < this.trail.length; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
            this.ctx.strokeStyle = `${this.color} ${0.05 * i + 0.05})`;
            this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
}
document.getElementById('closePopup').addEventListener('click', () => {
    const winPopup = document.getElementById('winPopup');
    winPopup.style.display = 'none';
});
difficulty.addEventListener('change', () => setDifficulty(difficulty.value));
numberOfLaps.addEventListener('change', () => game.winningLaps = numberOfLaps.value);
const startButton = document.getElementById("startGame");
export let isGameStarted = false;
startButton.addEventListener("click", () => {
    if (!isGameStarted) {
        game.startGame();
        isGameStarted = true;
    }
})