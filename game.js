// DOM elements
const difficultyEl = document.getElementById("difficulty");
let accDisplay = document.querySelector(".accuracy");
let accValue = document.querySelector(".acc");
let errorDisplay = document.querySelector(".errors");
let errorValue = document.querySelector(".errorsFound");
let highScoreValue = document.querySelector(".highscoreRecorded");
let resButton = document.querySelector(".resetBtn");
let timerValue = document.querySelector(".timing");
let userInput = document.querySelector(".inputBox");
let wordsValue = document.querySelector(".text");
let wpmDisplay = document.querySelector(".wpm");
let wpmValue = document.querySelector(".wpmData");

//Initialize
let accuracy = 0;
let characterTyped = 0;
let countdownTimer = 60;
let currentText = "";
let errors = 0;
let wpm = 0;
let highScore = localStorage.getItem("highScore");
let textLength = 0;
let timeElapsed = 0;
let timeLeft = countdownTimer;
let timer = null;
let totalErrors = 0;

// Event listener for difficulty change
difficultyEl.addEventListener("change", function () {
  difficulty = this.value;

  // Difficulty options - Time reduction
  if (difficulty === "easy") {
    countdownTimer = 60;
    countdownTimer.textContent = "60";
  } else if (difficulty === "medium") {
    countdownTimer = 55;
    countdownTimer.textContent = "55";
  } else if (difficulty === "hard") {
    countdownTimer = 50;
    countdownTimer.textContent = "50";
  }

  resetGame();

  // Prevent timer from running immediately after changing difficulty
  clearInterval(timer);
});

// Random tongue twister library
let twisterText = [
  "she sells seashells by the seashore",
  "fred fed ted bread and ted fed fred bread",
  "peter piper picked a peck of pickled peppers",
  "i saw a kitten eating chicken in the kitchen",
  "if a dog chews shoes whose shoes does he choose",
  "round and round the rugged rocks the ragged rascal ran",
  "give papa a cup of proper coffee in a copper coffee cup",
  "how much wood would a woodchuck chuck if a woodchuck could chuck wood",
];

//Generate tongue twister text
function generateText() {
  wordsValue.textContent = null;
  currentText = twisterText[textLength];
  // Split array of char -> Iterate over each char in array
  // -> Create new span element for each char -> Set innerText
  // -> Append each span element -> Display
  currentText.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    wordsValue.appendChild(charSpan);
  });

  if (textLength < twisterText.length - 1) {
    textLength++;
  } else {
    textLength = 0;
  }
}

function detectUserInput() {
  // Fetch current input text and split it
  curr_input = userInput.value;
  curr_input_array = curr_input.split("");
  //To detect characters typed by incrementing it
  characterTyped++;
  errors = 0;

  // WPM formula
  wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);
  // Update WPM
  wpmValue.textContent = wpm;

  // Check if user input is right or wrong
  quoteSpanArray = wordsValue.querySelectorAll("span");
  quoteSpanArray.forEach((char, index) => {
    let typedChar = curr_input_array[index];

    // No user input
    if (typedChar == null) {
      char.classList.remove("correctChar");
      char.classList.remove("incorrectChar");

      // User inputs correctly
    } else if (typedChar === char.innerText) {
      char.classList.add("correctChar");
      char.classList.remove("incorrectChar");

      // User inputs incorrectly
    } else {
      char.classList.add("incorrectChar");
      char.classList.remove("correctChar");

      // Error value increases after each incorrect char detected
      errors++;
    }
  });

  // Display number of errors
  errorValue.textContent = totalErrors + errors;

  // Update accuracy
  let correctCharacters = characterTyped - (totalErrors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
  accValue.textContent = Math.round(accuracyVal) + "%";

  // Current text typed out fully - irrespective of errors
  if (curr_input.length == currentText.length) {
    generateText();

    // Update total errors
    totalErrors += errors;
   
    // Clear user input
    userInput.value = "";
  }
}

// Timer
function updateTimer() {
  if (timeLeft > 0) {
    // Decrease time
    timeLeft--;

    // Total time taken
    timeElapsed++;

    // Update time left
    timerValue.textContent = timeLeft;
  } else {
    finishGame();
  }
}

// Timer runs out
function finishGame() {
  // Stop timer
  clearInterval(timer);

  // Display Game Over
  wordsValue.textContent = "GAME OVER";

  // Display restart button
  resButton.style.display = "block";

  // Update WPM value
  wpmValue.textContent = wpm;

  //Store and display high-score
  if (highScore !== 0) {
    if (wpm > highScore) {
      highScore = wpm;
      localStorage.setItem("highScore", wpm);
    } else {
      highScoreValue.textContent = highScore;
    }
  }

  // Display wpm
  wpmDisplay.style.display = "block";

  // Clear and hide input box
  userInput.value = "";
  userInput.style.display = "none";
}

// Start Game
function startGame() {
  resetGame();
  generateText();

  // Reset time
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

// Reset Game
function resetGame() {
  accValue.textContent = 0 + "%";
  accuracy = 0;
  characterTyped = 0;
  errorValue.textContent = 0;
  errors = 0;
  highScoreValue.textContent = highScore;
  resButton.style.display = "none";
  textLength = 0;
  timeElapsed = 0;
  timeLeft = countdownTimer;
  timerValue.textContent = timeLeft;
  totalErrors = 0;
  userInput.disabled = false;
  userInput.style.display = "block";
  userInput.value = "";
  wordsValue.textContent = "⬇ Click the box to start ⬇";
  wpmValue.textContent = 0;
}
