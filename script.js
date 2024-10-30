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

// Set game mode and adjust life settings
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

// Create individual player counter
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

    // Add control buttons for modes
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
    playerDiv.appendChild(controlButtons);

    // Append player to container
    document.getElementById('players-container').appendChild(playerDiv);
}

// Update life points with pulse animation
function adjustLifePoints(lifePointsElement, change) {
    let currentLife = parseInt(lifePointsElement.textContent);
    currentLife += change;
    lifePointsElement.textContent = Math.max(0, currentLife);
    lifePointsElement.classList.add('pulse');
    setTimeout(() => lifePointsElement.classList.remove('pulse'), 300);
}

// Countdown and random player selection with highlight
function startRandomPlayerCountdown() {
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.style.opacity = 1;

    // Darken the player containers
    document.querySelectorAll('.player').forEach(player => player.classList.add('darkened'));

    let countdown = Math.floor(Math.random() * 3) + 3;  // Random countdown between 3 and 5 seconds
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

// Select a random player to start and highlight their container
function selectRandomPlayer() {
    const players = document.querySelectorAll('.player');
    const randomIndex = Math.floor(Math.random() * players.length);
    const startingPlayer = players[randomIndex];

    startingPlayer.classList.add('selected');
    setTimeout(() => startingPlayer.classList.remove('selected'), 3000);

    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.textContent = `${startingPlayer.querySelector('h3').textContent} Starts!`;

    // Keep the display for 3 seconds, then fade out and reset the player containers
    setTimeout(() => {
        countdownDisplay.style.opacity = 0;
        document.querySelectorAll('.player').forEach(player => player.classList.remove('darkened'));
    }, 3000);
}
