// time: 22:00 redix
const problemElement = document.querySelector(".problem")
const ourForm = document.querySelector(".our-form")
const ourField = document.querySelector(".our-field")
const pointsNeeded = document.querySelector(".points-needed")
const mistakesAllowed = document.querySelector(".mistakes-allowed")
const progressBar = document.querySelector(".progress-inner")
const endMessage = document.querySelector(".end-message")
const resetButton = document.querySelector(".reset-button")

let state = {
  score: 0,
  wrongAnswers: 0
}

function updateProblem() {
  state.currentProblem = generateProblem()    // Added a property 'currentProblem' to state object.
  problemElement.innerHTML = `${state.currentProblem.numberOne} ${state.currentProblem.operator} ${state.currentProblem.numberTwo}`
  ourField.value = ""
  ourField.focus()
}

updateProblem()

function generateNumber(max) {
  return Math.floor(Math.random() * (max + 1))      // If max is 10, (max+1) is 11 so result will never be 11 as it is floored down.
}

function generateProblem() {
  return {
    numberOne: generateNumber(10),
    numberTwo: generateNumber(10),
    operator: ['+', '-', 'x'][generateNumber(2)]     // ~to var x = [a,b]; x[1] & here like x[random] as in the above comment.
  }
}

ourForm.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
  e.preventDefault()    // prevents the loading of pg, so the addition of ?.(currently nothing happens when u click submit so now i can do what i want

  let correctAnswer;
  // Before I worry about what the user typed in, I want to compute the correct answer
  const p = state.currentProblem
  if (p.operator == "+") correctAnswer = p.numberOne + p.numberTwo   // operator: +
  if (p.operator == "-") correctAnswer = p.numberOne - p.numberTwo   // operator: -
  if (p.operator == "x") correctAnswer = p.numberOne * p.numberTwo   // operator: x

  if (parseInt(ourField.value, 10) === correctAnswer) {
    state.score++
    pointsNeeded.textContent = 10 - state.score     // Kind of like innerHTML but since i already have html markup I'll use this appropriate method.
    updateProblem()
    
    renderProgressBar() // Updating progress bar on each correct answer
  } else {
    state.wrongAnswers++
    mistakesAllowed.textContent = 2 - state.wrongAnswers
    problemElement.classList.add("animate-wrong")
    setTimeout(() => problemElement.classList.remove("animate-wrong"), 331)
  }

  checkLogic()
}

function checkLogic() {
  // If you won
  if (state.score == 10) {
    endMessage.textContent = "Victory Royale!"
    document.body.classList.add("overlay-is-open")
    endMessage.style.color = "blue"
    /* I could try to focus the btn as soon as I display the overlay but the overlay takes 330ms to actually animate into view & in certain 
    web browsers if you try to focus an element before it's actually visible it won't be correctly focused it won't work so I must wait 331ms*/
    setTimeout(() => resetButton.focus(), 331)
  }

  // If you lost
  if (state.wrongAnswers == 3) {
    endMessage.textContent = "Sorry! You lost."

    endMessage.style.color = "red"
    document.body.classList.add("overlay-is-open")
    setTimeout(() => resetButton.focus(), 331)
  }
}

resetButton.addEventListener("click", resetGame)

function resetGame() {
  document.body.classList.remove("overlay-is-open")
  updateProblem()
  state.score = 0
  state.wrongAnswers = 0
  pointsNeeded.textContent = 10
  mistakesAllowed.textContent = 2
  progressBar.style.transform = `scaleX(0)`
  renderProgressBar()
}

function renderProgressBar() {
  progressBar.style.transform = `scaleX(${state.score / 10})`
}