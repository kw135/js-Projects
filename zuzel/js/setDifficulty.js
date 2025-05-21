import { game } from './main.js';
export default function (diff) {
    console.log("difficulty changed to: " + diff);
    switch (diff) {
        case "easy":
            game.playerSpeed = 10
            break;
        case "medium":
            game.playerSpeed = 15
            break;
        case "hard":
            game.playerSpeed = 20
            break;
        default:
            break;
    }
}