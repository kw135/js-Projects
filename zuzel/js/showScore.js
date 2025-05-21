import { game, isGameStarted } from "./main.js";
export default function () {
    const gameInfo = document.getElementById('gameInfo')
    gameInfo.style.display = 'flex';
    const container = document.getElementById("container")
    container.style.display = 'none';
    const players = document.getElementById("players")
    players.innerHTML = ''
    const scores = document.getElementById("scores")
    scores.innerHTML = ''
    const changeSettings = document.getElementById("changeSettings")
    changeSettings.style.display = 'block';
    changeSettings.addEventListener("click", () => {
        if (!isGameStarted) {
            container.style.display = 'flex';
            gameInfo.style.display = 'none';
            changeSettings.style.display = 'none';
            displaySettings();
            createTrack();
        }
    })
    game.players.forEach((player, i) => {
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        p1.textContent = `Gracz ${i + 1}`
        p1.style.color = `${player.color}1)`
        p1.style.fontWeight = '700'
        p2.textContent = `${Math.floor(player.laps.number / 2)}`
        players.appendChild(p1);
        scores.appendChild(p2);
    })
}