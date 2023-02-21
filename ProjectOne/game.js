// DOM elements
const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const accuracyEl = document.getElementById("accuracy");
const highScoreEl = document.getElementById("high-score");
const difficultyEl = document.getElementById("difficulty");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

// Initialize
let currentScore = 0;
//Set highScore or display 0 if does not exist
let highScore = localStorage.getItem('highScore') || 0;
let startTime;
let endTime;
let timeInterval;
let currentText;
let difficulty = difficultyEl.value;
let timeLimit = 60;

// Event listener for difficulty change
difficultyEl.addEventListener('change', function() {
  difficulty = this.value;
  resetGame();
});

// Event listener for user input
inputEl.addEventListener('input', function() {
  // Get user input and current text to type
  const inputText = this.value;
  const textToType = textEl.innerText;

  // Check if user has typed the entire text
  if (inputText === textToType) {

      currentText = generateRandomText(difficulty);
      textEl.innerText = currentText;
      inputEl.value = "";
    // Calculate score and accuracy
    // Convert milliseconds to seconds - /1000
    const elapsedTime = (endTime - startTime) / 1000;
    const wordsPerMinute = Math.round((textToType.split(' ').length / elapsedTime) * 60);
    const accuracy = Math.round((inputText.length / textToType.length) * 100);

    // Update current score and high score
    currentScore++
    
    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage.setItem('highScore', highScore);
    } else {
      highScore = 0;
    }

    // Update UI
    scoreEl.innerText = currentScore;
    accuracyEl.innerText = accuracy + '%';
    highScoreEl.innerText = highScore;

  }
});

// Function to start game
function startGame() {

  //Generate random word
  currentText = generateRandomText(difficulty);
  textEl.innerText = currentText;
  inputEl.value = '';

  //Start timer
  startTime = Date.now();
  endTime = startTime + timeLimit * 1000;
  timeInterval = setInterval(updateTimer, 10);
}

// Function to reset game
function resetGame() {
  clearInterval(timeInterval);
  timerEl.innerText = '0';
  scoreEl.innerText = '0';
}

// Function to update timer
function updateTimer() {
  const timeLeft = (endTime - Date.now()) / 1000;
  //Time runs out
  if (timeLeft <= 0) {
    clearInterval(timeInterval);
    scoreEl.innerText = currentScore;
    resetButton.style.display = 'block';
    timerEl.innerHTML = "Game Over";
  } else {
    timerEl.innerText = timeLeft.toFixed(2);
  }
}

// Function to generate random text
function generateRandomText(difficulty) {
  let text = "";
  let timeLimit = 3;
  if (difficulty === "easy") {
    const words = [
      "hello",
      "world",
      "easy",
      "game",
      "fun"];

    //Iterate through arrayf
    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      
      //Append random word from 'words' into 'text
      text += words[randomIndex] + " ";
    }
  } else if (difficulty === "medium") {
    const words = [
      "coding",
      "javascript",
      "computer",
      "program",
      "learning",
      "design",
    ];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      text += words[randomIndex] + " ";
    }
  } else if (difficulty === "hard") {
    const words = [
      "algorithm",
      "performance",
      "optimization",
      "framework",
      "architecture",
      "database",
    ];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      text += words[randomIndex] + " ";
    }
  }

  return text;
}

// Event listener for start & reset button
startButton.addEventListener('click', function () {
  startGame();
});

resetButton.addEventListener('click', function () {
  resetGame();
});