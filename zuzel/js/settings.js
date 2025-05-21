export function displaySettings() {
    const playerList = document.getElementById('playerList');
    const defaultKeys = ["a", "f", "j", "l"]
    const colors = ["red", "orange", "blue", "yellow"]
    playerList.innerHTML = ""
    const numberOfPlayers = document.getElementById('numberOfPlayers').value;
    const text = document.getElementById('text');
    text.innerHTML = `Liczba graczy: ${numberOfPlayers}`
    for (let i = 0; i < numberOfPlayers; i++) {
        const label = document.createElement('label');
        label.innerText = `Klawisz gracza ${i + 1}`;
        label.setAttribute('for', `player${i + 1}`);
        label.style.color = colors[i]
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', `player${i + 1}`);
        input.value = defaultKeys[i];
        playerList.append(label, input);
    }
}