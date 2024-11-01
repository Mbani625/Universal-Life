let currentGameMode = "mtg"; // Default to Magic the Gathering
let incrementValue = 1;
let startingLifeTotal = 20;

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open"); // Toggles the sidebar visibility
}

// Initialize players on page load
document.addEventListener("DOMContentLoaded", () => {
  initializePlayers(2); // Default to 1v1
});

// Prevent double-tap zoom on mobile
document.addEventListener(
  "touchstart",
  function preventDoubleTapZoom(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

function setGameMode(mode) {
  currentGameMode = mode;

  switch (mode) {
    case "mtg":
      startingLifeTotal = 20;
      incrementValue = 1;
      break;
    case "commander":
      startingLifeTotal = 40;
      incrementValue = 1;
      break;
    case "yugioh":
      startingLifeTotal = 8000;
      incrementValue = 50;
      break;
  }

  initializePlayers(
    document.getElementById("players-container").children.length || 2
  );
}

// Initialize players
function initializePlayers(playerCount) {
  const playersContainer = document.getElementById("players-container");
  playersContainer.innerHTML = ""; // Clear existing players

  for (let i = 1; i <= playerCount; i++) {
    createPlayerCounter(i);
  }
}

// Function to create each player's container with updated button structure
function createPlayerCounter(playerNumber) {
  const playerDiv = document.createElement("div");
  playerDiv.classList.add("player");

  const playerName = document.createElement("h3");
  playerName.textContent = `Player ${playerNumber}`;
  playerDiv.appendChild(playerName);

  const lifePoints = document.createElement("div");
  lifePoints.classList.add("life-points");
  lifePoints.textContent = startingLifeTotal;
  playerDiv.appendChild(lifePoints);

  // Control buttons container
  const controlButtons = document.createElement("div");
  controlButtons.classList.add("control-buttons");

  // Add Life (+) Button
  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.onmousedown = () => startAdjustingLife(lifePoints, incrementValue);
  addButton.ontouchstart = () => startAdjustingLife(lifePoints, incrementValue);
  addButton.onmouseup = stopAdjustingLife;
  addButton.ontouchend = stopAdjustingLife;

  // Subtract Life (-) Button
  const subtractButton = document.createElement("button");
  subtractButton.textContent = "-";
  subtractButton.onmousedown = () =>
    startAdjustingLife(lifePoints, -incrementValue);
  subtractButton.ontouchstart = () =>
    startAdjustingLife(lifePoints, -incrementValue);
  subtractButton.onmouseup = stopAdjustingLife;
  subtractButton.ontouchend = stopAdjustingLife;

  controlButtons.appendChild(addButton);
  controlButtons.appendChild(subtractButton);

  // Coin Flip Button
  const coinFlipButton = document.createElement("button");
  coinFlipButton.classList.add("coin-flip-button");
  coinFlipButton.onclick = () => showCoinFlipResult(playerDiv);

  // D6 Roll Button
  const d6Button = document.createElement("button");
  d6Button.classList.add("dice-button", "d6-button");
  d6Button.onclick = () => rollDice(6, playerDiv);

  // D20 Roll Button
  const d20Button = document.createElement("button");
  d20Button.classList.add("dice-button", "d20-button");
  d20Button.onclick = () => rollDice(20, playerDiv);

  // Append all buttons to controlButtons container
  controlButtons.appendChild(coinFlipButton);
  controlButtons.appendChild(d6Button);
  controlButtons.appendChild(d20Button);

  playerDiv.appendChild(controlButtons);
  document.getElementById("players-container").appendChild(playerDiv);
}

// Function to show coin flip result (Heads or Tails)
function showCoinFlipResult(playerDiv) {
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  displayResult(playerDiv, `Coin Flip: ${result}`);
}

// Roll the selected dice (D6 or D20) and display result
function rollDice(diceType, playerDiv) {
  const result = Math.floor(Math.random() * diceType) + 1;
  displayResult(playerDiv, `Dice Roll (D${diceType}): ${result}`);
}

// Function to display result under the player's container
function displayResult(playerDiv, message) {
  let resultDisplay = playerDiv.querySelector(".result-display");
  if (!resultDisplay) {
    resultDisplay = document.createElement("div");
    resultDisplay.classList.add("result-display");
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

// Hold down functionality for rapid life point adjustment
let adjustInterval;

function startAdjustingLife(lifePointsElement, change) {
  adjustLifePoints(lifePointsElement, change);
  adjustInterval = setInterval(
    () => adjustLifePoints(lifePointsElement, change),
    350
  );
}

function stopAdjustingLife() {
  clearInterval(adjustInterval);
}

// Randomize and select the starting player by highlighting each in succession
function startRandomPlayerSelection() {
  const countdownDisplay = document.getElementById("countdown-display");
  countdownDisplay.style.opacity = 1; // Make countdown visible
  countdownDisplay.style.zIndex = 1; // Keep countdown behind the button

  const players = document.querySelectorAll(".player");
  let randomIndex = 0;
  const highlightDuration = 250; // Duration for each player highlight (0.25 seconds)
  const totalDuration = 3000; // Total selection duration (3 seconds)

  // Darken all players initially
  players.forEach((player) => player.classList.add("darkened"));

  let elapsed = 0;

  // Interval to randomly highlight players one by one
  const interval = setInterval(() => {
    // Remove highlight from previous player
    if (players[randomIndex]) {
      players[randomIndex].classList.remove("selected");
    }

    // Select a new random player index
    randomIndex = Math.floor(Math.random() * players.length);
    players[randomIndex].classList.add("selected");

    elapsed += highlightDuration;

    if (elapsed >= totalDuration) {
      clearInterval(interval);
      finalizeStartingPlayer(players[randomIndex]);
    }
  }, highlightDuration);
}

// Finalize and display the selected starting player
function finalizeStartingPlayer(player) {
  const countdownDisplay = document.getElementById("countdown-display");

  // Reset darkening on all players and only keep the selected one highlighted
  document
    .querySelectorAll(".player")
    .forEach((p) => p.classList.remove("darkened", "selected"));
  player.classList.add("selected");

  // Hide countdown display after a short delay
  setTimeout(() => {
    countdownDisplay.style.opacity = 0;
  }, 3000);

  // Start fade effect after the selection process is complete
  setTimeout(() => {
    player.classList.add("fade"); // Add fade class to trigger animation
  }, 2000); // Delay added here to ensure the yellow remains for 2 seconds
}

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  // Toggle dark mode classes on necessary elements
  document.getElementById("sidebar").classList.toggle("dark-mode", isDarkMode);
  document
    .querySelectorAll(".player")
    .forEach((el) => el.classList.toggle("dark-mode", isDarkMode));
  document
    .querySelectorAll(".control-buttons button")
    .forEach((el) => el.classList.toggle("dark-mode", isDarkMode));
  document
    .getElementById("countdown-display")
    .classList.toggle("dark-mode", isDarkMode);

  // Save user preference
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

// Load the user's preference or default to light mode on page load
document.addEventListener("DOMContentLoaded", () => {
  const darkModePreference = localStorage.getItem("darkMode");
  const themeToggle = document.getElementById("theme-toggle");

  if (darkModePreference === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
    toggleDarkMode();
  } else {
    // Ensure light mode is active by default
    themeToggle.checked = false;
  }
});
