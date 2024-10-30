const responseContainer = document.getElementById("response-container");
const restartGameBtn = document.getElementById("restart-game-btn");
const guessCheckBtn = document.getElementById("guess-check-btn");

const wordBank = [
  "Apple",
  "Bread",
  "Crane",
  "Dream",
  "Eagle",
  "Frame",
  "Grace",
  "Heart",
  "Ideal",
  "Joker",
  "Knife",
  "Lemon",
  "Magic",
  "Night",
  "Ocean",
  "Party",
  "Queen",
  "River",
  "Stone",
  "Trust",
  "Urban",
  "Voice",
  "Water",
  "Youth",
  "Zebra",
  "Angel",
  "Bloom",
  "Climb",
  "Dance",
  "Earth",
  "Flame",
  "Ghost",
  "Happy",
  "Honey",
  "Light",
];

let currentAttempt = 0;
let currentAnswer;
const currentAnswerLetterFrequency = {};

const getFrequency = (word) => {
  word
    .toLowerCase()
    .split("")
    .forEach((letter) => {
      currentAnswerLetterFrequency[letter]
        ? currentAnswerLetterFrequency[letter]++
        : (currentAnswerLetterFrequency[letter] = 1);
    });
};

const useWordBank = () => {
  const randomIdx = Math.floor(Math.random() * 35);
  currentAnswer = wordBank[randomIdx];
  getFrequency(currentAnswer);
};

const getCurrentWord = (fetchWord = false) => {
  if (!fetchWord) {
    useWordBank();
    console.log("The answer for the current game is: ", currentAnswer);
    return;
  }

  url = `https://wordle-api3.p.rapidapi.com/getcurrentword`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "",
      "x-rapidapi-host": "wordle-api3.p.rapidapi.com",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      currentAnswer = data.word.charAt(0).toUpperCase() + data.word.slice(1);
      getFrequency(currentAnswer);
      console.log("The answer for the current game is: ", currentAnswer);
    })
    .catch((error) => {
      console.log("error: ", error);
      useWordBank();
      console.log("The answer for the current game is: ", currentAnswer);
    });
};

const rotateArrowVisibility = () => {
  if (currentAttempt > 6) return;
  const currentArrow = document.querySelector("div.arrow[data-active]");
  const nextArrow = document.getElementById(`row-${currentAttempt}`)
    .children[0];
  nextArrow.dataset.active = true;
  if (currentArrow !== null) {
    delete currentArrow.dataset.active;
  }
};

const finishGame = (correctGuess = false) => {
  let displayMessage;
  displayMessage = correctGuess
    ? `Congratulations! You took a total of ${currentAttempt} ${
        currentAttempt === 1 ? `guess` : `guesses`
      } to get the correct answer!`
    : `Nice try! The answer was ${currentAnswer}.`;

  window.alert(displayMessage);
};

guessCheckBtn.addEventListener("click", () => {
  const userGuessInput = document.getElementById("user-guess");
  let frequencyCopy = { ...currentAnswerLetterFrequency };
  userGuessText = userGuessInput.value;

  currentAttempt++;
  rotateArrowVisibility();

  const boxes = document.getElementById(`row-${currentAttempt}`).children;

  userGuessText.split("").forEach((letter, index) => {
    boxes[index + 1].innerHTML = letter.toUpperCase();

    mappedAnswerLetter = currentAnswer[index].toLowerCase();
    mappedGuessLetter = userGuessText[index].toLowerCase();

    if (
      mappedAnswerLetter === mappedGuessLetter &&
      frequencyCopy[mappedGuessLetter] > 0
    ) {
      boxes[index + 1].classList.add("correct-letter");
      frequencyCopy[mappedGuessLetter]--;
      return;
    }

    if (
      currentAnswer.includes(mappedGuessLetter) &&
      frequencyCopy[mappedGuessLetter] > 0
    ) {
      boxes[index + 1].classList.add("misplaced-letter");
      frequencyCopy[mappedGuessLetter]--;
      return;
    }

    boxes[index + 1].classList.add("absent-letter");
    return;
  });

  setTimeout(() => {
    if (
      userGuessText.toLowerCase() === currentAnswer.toLowerCase() ||
      currentAttempt > 5
    ) {
      if (userGuessText.toLowerCase() === currentAnswer.toLowerCase())
        finishGame(true);
      if (currentAttempt > 5) finishGame();

      responseContainer.style.display = "none";
      restartGameBtn.style.display = "block";
    }
  }, 0);
});

restartGameBtn.addEventListener("click", () => {
  responseContainer.style.display = "block";
  restartGameBtn.style.display = "none";
  document.getElementById("user-guess").value = "";
  currentAttempt = 0;

  const letterBoxes = document.querySelectorAll(".grid .letter-box");
  letterBoxes.forEach((el) => {
    el.classList.remove("correct-letter", "misplaced-letter", "absent-letter");
    el.innerHTML = "";
  });

  const currentArrow = document.querySelector("div.arrow[data-active]");
  delete currentArrow.dataset.active;

  getCurrentWord();
});

window.onload = () => {
  getCurrentWord(true);
};
