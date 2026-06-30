// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0; // Keeps track of the player's score
let timeRemaining = 30; // Countdown timer starting at 30 seconds
let timerId; // Will store our timer that counts down

// Arrays of possible messages
const winningMessages = [
  "🎉 You Win!",
  "🌟 Amazing!",
  "💧 Perfect!",
  "🏆 Champion!",
  "⭐ Excellent!"
];

const losingMessages = [
  "Try Again! 😢",
  "Keep Practicing! 🤓",
  "Not Bad! 🥴",
  "Better Luck Next Time! 😵‍💫",
  "You Can Do Better! 🫣"
];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  timeRemaining = 30; // Reset timer to 30 seconds
  document.getElementById("time").textContent = timeRemaining; // Update display
  
  // Hide start modal during gameplay
  document.getElementById("start-modal").classList.add("hidden");

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Start countdown timer
  timerId = setInterval(() => {
    timeRemaining--;
    document.getElementById("time").textContent = timeRemaining;

    // End game when timer reaches 0
    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker); // Stop creating new drops
  clearInterval(timerId); // Stop the timer

  // Display game over message
  const modal = document.getElementById("game-over-modal");
  const title = document.getElementById("game-over-title");
  const scoreText = document.getElementById("game-over-score");

  if (score >= 20) {
    const randomWinIndex = Math.floor(Math.random() * winningMessages.length);
    title.textContent = winningMessages[randomWinIndex];
  } else {
    const randomLoseIndex = Math.floor(Math.random() * losingMessages.length);
    title.textContent = losingMessages[randomLoseIndex];
  }

  scoreText.textContent = `Final Score: ${score}`;
  modal.classList.remove("hidden");
}

// Handle restart button
document.addEventListener("DOMContentLoaded", () => {
  const restartBtn = document.getElementById("restart-btn");
  restartBtn.addEventListener("click", () => {
    // Reset game state
    score = 0;
    document.getElementById("score").textContent = "0";
    document.getElementById("game-over-modal").classList.add("hidden");
    
    // Clear remaining drops from previous game
    const drops = document.querySelectorAll(".water-drop");
    drops.forEach(drop => drop.remove());
    
    // Start new game
    startGame();
  });

  // Reset button clears score and removes all drops but does not restart the game
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      score = 0;
      document.getElementById("score").textContent = "0";

      // Remove all drops (good and bad)
      const drops = document.querySelectorAll(".water-drop");
      drops.forEach(drop => drop.remove());

      // Reset timer value and display
      timeRemaining = 30;
      document.getElementById("time").textContent = timeRemaining;

      // Clear any existing countdown interval
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }

      // If the game is running, restart the countdown from the reset value
      if (gameRunning) {
        timerId = setInterval(() => {
          timeRemaining--;
          document.getElementById("time").textContent = timeRemaining;
          if (timeRemaining <= 0) {
            endGame();
          }
        }, 1000);
      }
    });
  }
});

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // Decide randomly whether this is a bad drop (25% chance)
  const isBad = Math.random() < 0.25;
  drop.className = isBad ? "water-drop bad-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Handle click events on the drop
  drop.addEventListener("click", () => {
    // Ignore clicks when the game is not running
    if (!gameRunning) return;

    // Prevent double-clicks
    drop.style.pointerEvents = "none";

    const wasBad = drop.classList.contains("bad-drop");
    if (wasBad) {
      score--; // Bad drops are worth -1
      drop.classList.add("clicked");
    } else {
      score++; // Good drop
      drop.classList.add("clicked");
    }

    document.getElementById("score").textContent = score; // Update score display

    // Delay removal so the color change is visible
    setTimeout(() => {
      drop.remove();
    }, 180);
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
