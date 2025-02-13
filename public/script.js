// Import Firebase authentication functions
import { signUp, login } from "./auth.js";

let currentGameMode = "mtg";
let startingLifeTotal = 20;

// 🎮 Game formats and settings
const gameFormats = {
  mtg: [
    { name: "Standard", players: 2, life: 20 },
    { name: "Modern", players: 2, life: 20 },
    { name: "Legacy", players: 2, life: 20 },
    { name: "Vintage", players: 2, life: 20 },
    { name: "Brawl", players: 2, life: 30 },
    { name: "Commander", players: 4, life: 40 },
  ],
  lorcana: [{ name: "Standard", players: 2, life: 0 }],
  yugioh: [
    { name: "Advanced", players: 2, life: 8000 },
    { name: "Traditional", players: 2, life: 8000 },
    { name: "Domain", players: 4, life: 8000 },
  ],
  sorcery: [
    { name: "Standard", players: 2, life: 20 },
    { name: "Multiplayer", players: 4, life: 20 },
  ],
  grandarchive: [{ name: "Standard", players: 2, life: 15 }],
};

// 🎮 Game Selection & Format Toggles
function showGameSelection() {
  toggleVisibility("game-mode-buttons", true);
  toggleVisibility("format-buttons", false);
  toggleVisibility("back-button", false);
}
window.showGameSelection = showGameSelection;

function showFormatOptions(game) {
  const formatButtons = document.getElementById("format-buttons");
  formatButtons.innerHTML = "";
  currentGameMode = game;

  gameFormats[game].forEach((format) => {
    let btn = document.createElement("button");
    btn.textContent = format.name;
    btn.onclick = () => setGameMode(format);
    formatButtons.appendChild(btn);
  });

  toggleVisibility("game-mode-buttons", false);
  toggleVisibility("format-buttons", true);
  toggleVisibility("back-button", true);
}
window.showFormatOptions = showFormatOptions;

function setGameMode(format) {
  startingLifeTotal = format.life;
  initializePlayers(format.players);
}
window.setGameMode = setGameMode;

// 🎭 Toggle Utility Function
function toggleVisibility(elementId, show) {
  const element = document.getElementById(elementId);
  if (element) element.style.display = show ? "block" : "none";
}

// 🏆 Player Setup
function initializePlayers(playerCount) {
  const playersContainer = document.getElementById("players-container");
  const tableBody = document.getElementById("table-body");

  if (!playersContainer || !tableBody) {
    console.error(
      "Error: Players container or table body not found. Creating missing elements..."
    );

    if (!playersContainer) {
      const newPlayersContainer = document.createElement("div");
      newPlayersContainer.id = "players-container";
      document.body.appendChild(newPlayersContainer);
    }

    if (!tableBody) {
      const newTableBody = document.createElement("tbody");
      newTableBody.id = "table-body";
      const table = document.querySelector("table");
      if (table) {
        table.appendChild(newTableBody);
      } else {
        console.error("Error: Table element not found in document.");
        return;
      }
    }
  }

  // Clear existing players
  playersContainer.innerHTML = "";
  tableBody.innerHTML = "";

  let playerOrder = [];
  if (playerCount === 4) {
    playerOrder = [1, 2, 4, 3]; // Corrected 4-player order
  } else {
    for (let i = 1; i <= playerCount; i++) {
      playerOrder.push(i);
    }
  }

  playerOrder.forEach((id) => {
    createPlayerCounter(id);
    addPlayerToTable(id);
  });
}
window.initializePlayers = initializePlayers;

function resetGameBoard() {
  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    tableBody.innerHTML = ""; // 🔹 Clear existing table rows when switching games
  }
}

function createPlayerCounter(playerId) {
  const playerDiv = document.createElement("div");
  playerDiv.classList.add("player");
  playerDiv.dataset.playerId = playerId;

  playerDiv.innerHTML = `
    <div class="player-number">P${playerId}</div>
    <div class="life-points" onclick="openLifePointPopup(${playerId})">${startingLifeTotal}</div>
    <div class="control-buttons">
      <button class="adjust-life" data-change="1">+</button>
      <button class="adjust-life" data-change="-1">-</button>

      <button class="coin-flip" data-player="${playerId}">
        <img src="path-to-coin-icon.png" alt="Coin Flip">
      </button>

      <button class="dice-roll" data-dice="6" data-player="${playerId}">
        <img src="path-to-d6-icon.png" alt="Roll D6">
      </button>

      <button class="dice-roll" data-dice="20" data-player="${playerId}">
        <img src="path-to-d20-icon.png" alt="Roll D20">
      </button>

      <button class="invert" onclick="invertPlayerContainer(${playerId})">⇅</button>
      <button class="player-login" onclick="openLoginPopup(${playerId})">⋮</button>
    </div>
    <p class="player-name">Guest</p>
  `;

  document.getElementById("players-container").appendChild(playerDiv);
}

// 🎲 Event Listeners for Coin Flip and Dice Rolls
document.addEventListener("click", (e) => {
  const target = e.target.closest("button");

  if (!target) return;

  if (target.classList.contains("coin-flip")) {
    const playerId = target.getAttribute("data-player");
    showCoinFlipResult(playerId);
  }

  if (target.classList.contains("dice-roll")) {
    const playerId = target.getAttribute("data-player");
    const diceType = parseInt(target.getAttribute("data-dice"));
    rollDice(diceType, playerId);
  }
});

function updatePlayerName(playerId, username) {
  const playerNameElement = document.querySelector(
    `[data-player-id='${playerId}'] .player-name`
  );
  if (playerNameElement) {
    playerNameElement.textContent = username;
  }
}
window.updatePlayerName = updatePlayerName;

function openLifePointPopup(playerId) {
  closePopup(); // 🔹 Ensure no other popups exist

  const existingPopup = document.querySelector(".life-popup");
  if (existingPopup) return; // 🔹 Prevent multiple popups from being created

  const popup = document.createElement("div");
  popup.classList.add("popup", "life-popup"); // 🔹 Use universal "popup" class
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Adjust Life Points</h3>
      <input type="number" id="life-input" placeholder="Enter amount">
      <div class="popup-buttons">
        <button onclick="adjustLifeFromInput(${playerId}, 'add')">Add</button>
        <button onclick="adjustLifeFromInput(${playerId}, 'subtract')">Subtract</button>
        <button onclick="closePopup()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
}
window.openLifePointPopup = openLifePointPopup;

function adjustLifeFromInput(playerId, operation) {
  const inputField = document.getElementById("life-input");
  if (!inputField) return;

  let value = parseInt(inputField.value);
  if (isNaN(value) || value <= 0) return; // Ignore invalid inputs

  const lifePointsElement = document.querySelector(
    `[data-player-id='${playerId}'] .life-points`
  );
  if (!lifePointsElement) return;

  let currentLife = parseInt(lifePointsElement.textContent);
  let newLife = operation === "add" ? currentLife + value : currentLife - value;

  lifePointsElement.textContent = Math.max(0, newLife); // Prevent negative LP
  closePopup(); // 🔹 Close the popup after updating life points
}
window.adjustLifeFromInput = adjustLifeFromInput;

function invertPlayerContainer(playerId) {
  const playerDiv = document.querySelector(`[data-player-id='${playerId}']`);

  if (!playerDiv) return;

  // Toggle a CSS class to rotate the player container
  playerDiv.classList.toggle("inverted");
}
window.invertPlayerContainer = invertPlayerContainer;

function addPlayerToTable(playerId) {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) return;

  let row = document.createElement("tr");
  row.dataset.playerId = playerId;
  row.innerHTML = `
    <td>Player ${playerId}</td>
    <td class="player-life">${startingLifeTotal}</td>
    <td>
      <button onclick="adjustLifePoints(${playerId}, 1)">+</button>
      <button onclick="adjustLifePoints(${playerId}, -1)">-</button>
    </td>
  `;
  tableBody.appendChild(row);
}

// 🎲 Life Point Adjustments
function adjustLifePoints(playerId, change) {
  const playerDiv = document.querySelector(
    `[data-player-id='${playerId}'] .life-points`
  );
  const tableLife = document.querySelector(
    `tr[data-player-id='${playerId}'] .player-life`
  );

  if (playerDiv) {
    let newLife = Math.max(0, parseInt(playerDiv.textContent) + change);
    playerDiv.textContent = newLife;
    if (tableLife) tableLife.textContent = newLife;
  }
}
window.adjustLifePoints = adjustLifePoints;

// 🔄 Sidebar & Theme Toggle
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
window.toggleSidebar = toggleSidebar;

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
}
window.toggleDarkMode = toggleDarkMode;

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true")
    document.body.classList.add("dark-mode");
  showGameSelection();
});

function closePopup() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.remove(); // 🔹 Removes any open popup
  });
}
window.closePopup = closePopup;

function showCoinFlipResult(playerId) {
  const playerDiv = document.querySelector(`[data-player-id='${playerId}']`);
  if (!playerDiv) return;

  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  displayResult(playerDiv, `Coin Flip: ${result}`);
}
window.showCoinFlipResult = showCoinFlipResult;

function rollDice(diceType, playerId) {
  const playerDiv = document.querySelector(`[data-player-id='${playerId}']`);
  if (!playerDiv) return;

  const result = Math.floor(Math.random() * diceType) + 1;
  displayResult(playerDiv, `D${diceType}: ${result}`);
}
window.rollDice = rollDice;

function displayResult(playerDiv, message) {
  let resultDisplay = playerDiv.querySelector(".result-display");

  if (!resultDisplay) {
    resultDisplay = document.createElement("div");
    resultDisplay.classList.add("result-display");
    playerDiv.appendChild(resultDisplay);
  }

  resultDisplay.textContent = message;
}
