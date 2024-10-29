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
let correctAnswer;
const correctAnswerLetterFrequency = {};

const getFrequency = (word) => {
  word.split("").forEach((letter) => {
    correctAnswerLetterFrequency[letter.toLowerCase()]
      ? correctAnswerLetterFrequency[letter.toLowerCase()]++
      : (correctAnswerLetterFrequency[letter.toLowerCase()] = 1);
  });
};

const useWordBank = () => {
  const randomIdx = Math.floor(Math.random() * 35);
  correctAnswer = wordBank[randomIdx];
  getFrequency(correctAnswer);
};

const getCurrentWord = (fetchWord = false) => {
  if (!fetchWord) {
    useWordBank();
    return;
  }

  url = `https://wordle-api3.p.rapidapi.com/getcurrentword`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "5c547f3788msh007f4139bb62e23p1dce91jsnd655fb0d4e13",
      "x-rapidapi-host": "wordle-api3.p.rapidapi.com",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      correctAnswer = data.word;
      getFrequency(correctAnswer);
    })
    .catch((error) => {
      console.log("error: ", error);
      useWordBank();
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
    : `Nice try! The answer was ${correctAnswer}.`;

  window.alert(displayMessage);
};

guessCheckBtn.addEventListener("click", () => {
  const userGuessInput = document.getElementById("user-guess");
  userGuessText = userGuessInput.value;

  currentAttempt++;

  rotateArrowVisibility();

  let frequencyCopy = { ...correctAnswerLetterFrequency };

  const boxes = document.getElementById(`row-${currentAttempt}`).children;

  userGuessText.split("").forEach((letter, index) => {
    boxes[index + 1].innerHTML = letter.toUpperCase();

    mappedAnswerLetter = correctAnswer[index].toLowerCase();
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
      correctAnswer.includes(mappedGuessLetter) &&
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
      userGuessText.toLowerCase() === correctAnswer.toLowerCase() ||
      currentAttempt > 5
    ) {
      if (userGuessText.toLowerCase() === correctAnswer.toLowerCase())
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
});

window.onload = () => {
  getCurrentWord(true);
};
