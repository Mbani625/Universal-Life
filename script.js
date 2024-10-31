let currentGameMode = 'mtg'; // Default to Magic the Gathering
let incrementValue = 1;
let startingLifeTotal = 20;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); // Toggles the sidebar visibility
}

// Initialize players on page load
document.addEventListener('DOMContentLoaded', () => {
    initializePlayers(2); // Default to 1v1
});

function setGameMode(mode) {
    currentGameMode = mode;

    switch (mode) {
        case 'mtg':
            startingLifeTotal = 20;
            incrementValue = 1;
            break;
        case 'commander':
            startingLifeTotal = 40;
            incrementValue = 1;
            break;
        case 'yugioh':
            startingLifeTotal = 8000;
            incrementValue = 50;
            break;
    }

    initializePlayers(document.getElementById('players-container').children.length || 2);
}

// Initialize players
function initializePlayers(playerCount) {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = ''; // Clear existing players

    for (let i = 1; i <= playerCount; i++) {
        createPlayerCounter(i);
    }
}

// Function to create each player's container with updated button structure
function createPlayerCounter(playerNumber) {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');

    const playerName = document.createElement('h3');
    playerName.textContent = `Player ${playerNumber}`;
    playerDiv.appendChild(playerName);

    const lifePoints = document.createElement('div');
    lifePoints.classList.add('life-points');
    lifePoints.textContent = startingLifeTotal;
    playerDiv.appendChild(lifePoints);

    // Control buttons container
    const controlButtons = document.createElement('div');
    controlButtons.classList.add('control-buttons');

    // Add Life (+) Button
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.onclick = () => adjustLifePoints(lifePoints, incrementValue);

    // Subtract Life (-) Button
    const subtractButton = document.createElement('button');
    subtractButton.textContent = '-';
    subtractButton.onclick = () => adjustLifePoints(lifePoints, -incrementValue);

    controlButtons.appendChild(addButton);
    controlButtons.appendChild(subtractButton);

    // Coin Flip Button
    const coinFlipButton = document.createElement('button');
    coinFlipButton.classList.add('coin-flip-button');
    coinFlipButton.onclick = () => showCoinFlipResult(playerDiv);

    // D6 Roll Button
    const d6Button = document.createElement('button');
    d6Button.classList.add('dice-button', 'd6-button');
    d6Button.onclick = () => rollDice(6, playerDiv);

    // D20 Roll Button
    const d20Button = document.createElement('button');
    d20Button.classList.add('dice-button', 'd20-button');
    d20Button.onclick = () => rollDice(20, playerDiv);

    // Append all buttons to controlButtons container
    controlButtons.appendChild(coinFlipButton);
    controlButtons.appendChild(d6Button);
    controlButtons.appendChild(d20Button);

    playerDiv.appendChild(controlButtons);
    document.getElementById('players-container').appendChild(playerDiv);
}

// Function to show coin flip result (Heads or Tails)
function showCoinFlipResult(playerDiv) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    displayResult(playerDiv, `Coin Flip: ${result}`);
}

// Roll the selected dice (D6 or D20) and display result
function rollDice(diceType, playerDiv) {
    const result = Math.floor(Math.random() * diceType) + 1;
    displayResult(playerDiv, `Dice Roll (D${diceType}): ${result}`);
}

// Function to display result under the player's container
function displayResult(playerDiv, message) {
    let resultDisplay = playerDiv.querySelector('.result-display');
    if (!resultDisplay) {
        resultDisplay = document.createElement('div');
        resultDisplay.classList.add('result-display');
        playerDiv.appendChild(resultDisplay);
    }
    resultDisplay.textContent = message;
}

// Update life points with pulse animation
function adjustLifePoints(lifePointsElement, change) {
    let currentLife = parseInt(lifePointsElement.textContent);
    currentLife += change;
    lifePointsElement.textContent = Math.max(0, currentLife);
}

// Start countdown for randomizing player
function startRandomPlayerCountdown() {
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.style.opacity = 1; // Make countdown visible

    // Darken all player containers
    document.querySelectorAll('.player').forEach(player => player.classList.add('darkened'));

    let countdown = 3; // Set countdown start
    countdownDisplay.textContent = countdown;

    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else {
            clearInterval(interval);
            selectRandomPlayer(); // Select player when countdown reaches 0
        }
    }, 1000);
}

// Function to select and highlight a random player
function selectRandomPlayer() {
    const players = document.querySelectorAll('.player');
    const randomIndex = Math.floor(Math.random() * players.length); // Pick a random player
    const startingPlayer = players[randomIndex];

    // Highlight the selected player
    startingPlayer.classList.add('selected');
    setTimeout(() => startingPlayer.classList.remove('selected'), 3000); // Remove highlight after 3 seconds

    // Display the selected player's name
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.textContent = `${startingPlayer.querySelector('h3').textContent} Starts!`;

    // Fade out countdown display and reset player darkening
    setTimeout(() => {
        countdownDisplay.style.opacity = 0;
        document.querySelectorAll('.player').forEach(player => player.classList.remove('darkened'));
    }, 3000);
}

