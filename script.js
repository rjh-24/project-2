let currentAttempt = 0;
let correctAnswer = "boats";

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

  const boxes = document.getElementById(`row-${currentAttempt}`).children;

  userGuessText.split("").map((letter, index) => {
    boxes[index + 1].innerHTML = letter.toUpperCase();

    mappedAnswerLetter = correctAnswer[index];
    mappedGuessLetter = userGuessText[index];
    console.log("mappedCurrentUserLetter: ", userGuessText[index]);

    if (mappedAnswerLetter === mappedGuessLetter) {
      boxes[index + 1].classList.add("correct-letter");
      return;
    }

    if (correctAnswer.includes(mappedGuessLetter)) {
      boxes[index + 1].classList.add("misplaced-letter");
      return;
    }

    boxes[index + 1].classList.add("absent-letter");
    return;
  });
});
