let currentAttempt = 1;

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
  rotateArrowVisibility();
};

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  currentAttempt++;
  rotateArrowVisibility();
});
