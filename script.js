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

    // Set life totals and increments based on selected mode
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
        case 'custom':
            startingLifeTotal = 20;
            incrementValue = 0; // No buttons for increment/decrement in custom mode
            break;
    }

    // Reinitialize players with new settings
    initializePlayers(document.getElementById('players-container').children.length || 2);
}

function initializePlayers(playerCount) {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = ''; // Clear existing players

    for (let i = 1; i <= playerCount; i++) {
        createPlayerCounter(i);
    }
}

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

    if (currentGameMode === 'custom') {
        // Custom mode: add scroll input for life points
        const lifeInput = document.createElement('input');
        lifeInput.type = 'number';
        lifeInput.value = startingLifeTotal;
        lifeInput.classList.add('custom-life-input');
        lifeInput.oninput = () => {
            lifePoints.textContent = lifeInput.value;
        };

        // Clear the life points text and add scroll input only
        playerDiv.innerHTML = '';
        playerDiv.appendChild(playerName);
        playerDiv.appendChild(lifeInput);
    } else {
        // Add control buttons for other modes
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
    }

    // Append player to container
    document.getElementById('players-container').appendChild(playerDiv);
}

function adjustLifePoints(lifePointsElement, change) {
    let currentLife = parseInt(lifePointsElement.textContent);
    currentLife += change;
    lifePointsElement.textContent = Math.max(0, currentLife);
}

// Countdown and random player selection logic
function startRandomPlayerCountdown() {
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.style.opacity = 1;

    // Darken the player containers
    document.querySelectorAll('.player').forEach(player => player.classList.add('darkened'));

    let countdown = 3;
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

function selectRandomPlayer() {
    const players = document.querySelectorAll('.player h3');
    const randomIndex = Math.floor(Math.random() * players.length);
    const startingPlayer = players[randomIndex].textContent;

    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.textContent = `${startingPlayer} Starts!`;

    // Keep the display for 3 seconds, then fade out and reset the player containers
    setTimeout(() => {
        countdownDisplay.style.opacity = 0;
        document.querySelectorAll('.player').forEach(player => player.classList.remove('darkened'));
    }, 3000);
}
