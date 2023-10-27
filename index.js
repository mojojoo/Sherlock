/** @format */
//API @https://the-trivia-api.com
import { API_URL } from "./api.js";
import { categories } from "./categories.js";

//grab the elements
const inputElement = document.querySelector("input");
const buttonElement = document.querySelector(".confirm");
const questionElement = document.querySelector(".questions");
const choicesElement = document.querySelector("ul");
const headerElement = document.querySelector(".header");
const categoriesArray = document.querySelector(".categories");
const categorieInput = document.querySelector(".categorieInput");
const btnStart = document.querySelector(".btnStart");
const timeElement = document.querySelector(".timer");
const correctElement = document.querySelector(".correct-answer");
const mistakeElement = document.querySelector(".mistakes");
const tryAgain = document.querySelector(".try-again");
const error = document.querySelector(".error");

document.querySelector(".end").style.display = "none";

categorieInput.value = "";

//putting the categories inside of the button element
categories.forEach((category) => {
  const button = document.createElement("button");
  button.className = "btn btn-dark clickCats";
  button.innerHTML = category;

  categoriesArray.appendChild(button);
});

//changeable values
let values;
let myTimer = 60;
let myTime;

const btnElemnts = document.querySelectorAll(".clickCats");

//addding eventListiner to every category
btnElemnts.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let value = categorieInput.value;
    const target = e.currentTarget.innerHTML;

    if (target) {
      categorieInput.value = target;
      values = target;
    }
  });
});

//handling the state of the game
const quizState = {
  next: 0,
  correct: 0,
  mistakes: 0,
};

function showError() {
  error.style.display = "none";
}

//start the quiz
btnStart.addEventListener("click", () => {
  const valueElement = categorieInput.value;

  if (valueElement === "") {
    error.style.display = "block";
    const myTimeout = setTimeout(showError, 3000);
  } else {
    document.querySelector(".start").style.display = "none";
    myTime = setInterval(utilTime, 1000);
    getQuiz(values);
  }
  inputElement.value = "";
});

//tryagain
tryAgain.addEventListener("click", () => {
  document.querySelector(".end").style.display = "none";
  document.querySelector(".start").style.display = "flex";
  myTimer = 60;
  quizState.correct = 0;
  quizState.mistakes = 0;

  categorieInput.value = "";
  inputElement.value = "";
});

//timer
function utilTime() {
  myTimer--;
  timeElement.innerHTML = `${myTimer}s`;
  if (myTimer === 0) {
    clearInterval(myTime);
    values = "";
    document.querySelector(".end").style.display = "flex";
    correctElement.innerHTML = quizState.correct;
    mistakeElement.innerHTML = quizState.mistakes;
  }
}

let jsons;

//get the API using async functing
async function getQuiz(value) {
  const response = await fetch(`${API_URL}${values}&limit=50`);
  const json = await response.json();

  jsons = json;
  showDisplay();
}

//function to show the quizzez
function showDisplay() {
  choicesElement.innerHTML = "";
  const json = jsons;

  const quizzez = json[quizState.next].question.text;
  const correctAnswer = json[quizState.next].correctAnswer;
  const incorrectAnswer = json[quizState.next].incorrectAnswers;
  const difficulty = json[quizState.next].difficulty;
  const choices = incorrectAnswer.push(correctAnswer);

  //create elemnts for difficulty and category
  const showHeader = `
            <h4>Category: <span>${values}</span></h4>
            <h4>Difficulty: <span>${difficulty}</span></h4>`;

  headerElement.innerHTML = showHeader;

  questionElement.innerHTML = quizzez;

  incorrectAnswer.forEach((choice) => {
    const li = document.createElement("li");
    li.innerHTML = choice;

    choicesElement.appendChild(li);
  });
  if (!json) {
    getQuiz(values);
  }
}

//to get the asnwer and the next question
function loadQuizzez() {
  const json = jsons;
  const correctAnswer = json[quizState.next].correctAnswer;

  const answerValue = inputElement.value;
  if (answerValue === correctAnswer) {
    showDisplay();
    quizState.correct += 1;
    quizState.next += 1;
  } else {
    showDisplay();
    quizState.mistakes += 1;
    quizState.next += 1;
  }
  inputElement.value = "";
}

buttonElement.addEventListener("click", () => {
  loadQuizzez();
});
