let currentGameMode = 'mtg'; // Default to Magic the Gathering
let incrementValue = 1;
let startingLifeTotal = 20;
let activePlayerDiv = null;

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

// Function to create each player's container with new Coin Flip and Dice Roll buttons
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

    // Add control buttons for life point adjustments
    const controlButtons = document.createElement('div');
    controlButtons.classList.add('control-buttons');

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.onclick = () => adjustLifePoints(lifePoints, incrementValue);

    const subtractButton = document.createElement('button');
    subtractButton.textContent = '-';
    subtractButton.onclick = () => adjustLifePoints(lifePoints, -incrementValue);

    controlButtons.appendChild(addButton);
    controlButtons.appendChild(subtractButton);

    // Add Coin Flip Button
    const coinFlipButton = document.createElement('button');
    coinFlipButton.classList.add('icon-button', 'coin-button');
    coinFlipButton.onclick = () => showCoinFlipResult(playerDiv);

    // Add Dice Roll Button
    const diceRollButton = document.createElement('button');
    diceRollButton.classList.add('icon-button', 'dice-button');
    diceRollButton.onclick = () => openDiceModal(playerDiv);

    // Add new buttons to controlButtons container
    controlButtons.appendChild(coinFlipButton);
    controlButtons.appendChild(diceRollButton);

    playerDiv.appendChild(controlButtons);
    document.getElementById('players-container').appendChild(playerDiv);
}

// Function to show coin flip result (Heads or Tails)
function showCoinFlipResult(playerDiv) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    displayResult(playerDiv, `Coin Flip: ${result}`);
}

// Open the dice modal and set the active player
function openDiceModal(playerDiv) {
    activePlayerDiv = playerDiv;
    document.getElementById('dice-modal').style.display = 'flex'; // Show modal only on dice button click
}

// Close the dice modal
function closeDiceModal() {
    document.getElementById('dice-modal').style.display = 'none'; // Hide modal
    activePlayerDiv = null;
}

// Roll the selected dice (D6 or D20) and display result
function rollDice(diceType) {
    const result = Math.floor(Math.random() * diceType) + 1;
    displayResult(activePlayerDiv, `Dice Roll (D${diceType}): ${result}`);
    closeDiceModal();
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

// Randomize starting player with countdown display
function startRandomPlayerCountdown() {
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.style.opacity = 1;

    // Darken other player containers
    document.querySelectorAll('.player').forEach(player => player.classList.add('darkened'));

    let countdown = 3; // Countdown starts from 3
    countdownDisplay.textContent = countdown;

    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else {
            clearInterval(interval);
            selectRandomPlayer();
        }
    }, 1000);
}

// Function to select and highlight a random player
function selectRandomPlayer() {
    const players = document.querySelectorAll('.player');
    const randomIndex = Math.floor(Math.random() * players.length);
    const startingPlayer = players[randomIndex];

    // Highlight the selected player
    startingPlayer.classList.add('selected');
    setTimeout(() => startingPlayer.classList.remove('selected'), 3000);

    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.textContent = `${startingPlayer.querySelector('h3').textContent} Starts!`;

    // Remove darkening and fade out countdown after 3 seconds
    setTimeout(() => {
        countdownDisplay.style.opacity = 0;
        document.querySelectorAll('.player').forEach(player => player.classList.remove('darkened'));
    }, 3000);
}
