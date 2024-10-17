let currentAttempt = 0;
let correctAnswer = "gulag";
const correctAnswerLetterFrequency = {};

correctAnswer.split("").forEach((letter) => {
  correctAnswerLetterFrequency[letter]
    ? correctAnswerLetterFrequency[letter]++
    : (correctAnswerLetterFrequency[letter] = 1);
});

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

window.onload = () => {
  // rotateArrowVisibility();
};

const btn = document.getElementById("guess-check-btn");

btn.addEventListener("click", () => {
  const userGuessInput = document.getElementById("user-guess");
  userGuessText = userGuessInput.value;
  currentAttempt++;
  rotateArrowVisibility();

  let frequencyCopy = { ...correctAnswerLetterFrequency };

  const boxes = document.getElementById(`row-${currentAttempt}`).children;

  userGuessText.split("").map((letter, index) => {
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
});
