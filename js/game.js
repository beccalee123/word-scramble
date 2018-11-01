'use strict';

var roundCount;
var endGameScore = [0];
var currentWordScramble;

var oldWordScramble;
var newWordScramble;

var SWAPSPEED = 3.5;
var SWAPYAMPLITUDE = 2;

// notification on page leave
window.addEventListener('beforeunload', function(e) { return 'dummy text';});

// change nav item color
document.getElementsByTagName('li')[1].classList.add('selectedPage')

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('skipWord').addEventListener('click', skipWord);
document.getElementById('shuffle').addEventListener('click', swapLetters);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              Element Variables
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var startGameButton = document.getElementById('startGame');
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              timer globals
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var timer; // pointer to setInterval for stopping and starting timer

var updateInterval = 10; // time in ms between renders
var startTime; // time user begins playing

var initialTimeAllowed = 60 * 2 * 1000; // start time at beginning in ms
var maxTimeAllowed = 60 * 5 * 1000; // max allowed time in ms

var timeLeft = initialTimeAllowed; // remaining time
var bonusTime = 0; // accumulated bonus time in ms
var penaltyTime = 0; // accumulated time penalty
var started = false; // tracks whether the game is started for initial render

function swapLetters() {
  if (started){
    oldWordScramble = currentWordScramble;
    newWordScramble = scrambledWord(roundCount).toUpperCase();
    handleSwapButton();
  }
}

function skipWord() {
  if (started){  // added this
    clearInput();
    subTime();
    roundCount++;
    currentWordScramble = scrambledWord(roundCount).toUpperCase();
    initializeCanvasWithANewWord(currentWordScramble);  // added
  
    // console.log(currentWordScramble);
    document.getElementById('alerts').innerHTML = `Looks like you had a whale of a time with that one. The correct answer was ${shuffledList[roundCount - 1].toUpperCase()}.`;
    resetFocus();
  }
}

function resetFocus() {
  document.getElementById('input').focus();
}


function startGame() {
  startTimer();
  roundCount = 0;
  currentWordScramble = scrambledWord(roundCount).toUpperCase();
  // console.log(currentWordScramble);
  initializeCanvasWithANewWord(currentWordScramble);  // added
  activateSubmission();
  createScoreCounter();
  resetFocus();
  activateSkip();
  hide(startGameButton, 'none');
  activateRestart();
}


function endGame() {
  endGameDataCollection();
  deactivateSubmission();
  deactivateSkip();
  endGameStyling();
  started = false;
  //TODO reset/restart button
}

function endGameStyling() {
  document.getElementById('gameSpace').style.backgroundColor = 'lightblue';
  document.getElementById('gameSpace').style.borderColor = 'navy';
  document.getElementById('timerBar').style.visibility = 'hidden';
}

function hide(element, hiddenOrNone) {
  if (hiddenOrNone === 'hidden') {
    element.style.visibility = 'hidden';
  } else if (hiddenOrNone === 'none') {
    element.style.display = 'none';
  } else {
    console.log('wrong hiddenOrNone argument')
  }
  
}

function unHide(element) {
  element.style.visibility = 'visible';
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              timer functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function resetTimer() {
  // disable interval function calls
  timeLeft = initialTimeAllowed; // remaining time
  bonusTime = 0; // accumulated bonus time in ms
  penaltyTime = 0; // accumulated time penalty

  clearInterval(timer);
  started = false;
  bonusTime = 0;
  renderTimer();
}

function startTimer() {
  if (!started) {
    startTime = Date.now();
  }
  started = true;
  timer = setInterval(renderTimer, updateInterval);
}

function addTime() {
  bonusTime = bonusTime + 15000;
  // cap bonus time
  var maxBonusTime = maxTimeAllowed - initialTimeAllowed;
  if (bonusTime > maxBonusTime) {
    bonusTime = maxBonusTime;
  }

  renderTimer();
}

function subTime() {
  penaltyTime = penaltyTime + 15000;
  renderTimer();
}

// called constantly during game
function renderTimer() {
  // if game hasn't started render 0 sec time elapsed
  var timeElapsed;
  if (started) {
    timeElapsed = Date.now() - startTime;
  } else {
    timeElapsed = 0;
  }

  // ~~~~~~ main decrement time ~~~~~~~~~
  timeLeft = initialTimeAllowed - timeElapsed + bonusTime - penaltyTime;

  // game over
  if (timeLeft < 0) {
    timeLeft = 0;
    clearInterval(timer); // cancel constant timer calls to this function
    endGame();
  }

  // if too much bonus time
  if (timeLeft > maxTimeAllowed) {
    // calculate extra bonus time
    var extraBonusTime = timeLeft - maxTimeAllowed;

    //remove the exess bonus time
    bonusTime = bonusTime - extraBonusTime;

    // cap time left
    timeLeft = maxTimeAllowed;
  }

  // time bar
  document.getElementById('timerBar').style.width = `${(timeLeft /
    maxTimeAllowed) * 600}px`;
  // document.getElementById("timerBar").textContent = `${timeLeft / 1000}`;
}

renderTimer();


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~ global animation variables ~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create canvas
// TODO: is this the best place for this? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext("2d");
ctx.font = "3em 'Overpass Mono'";

var letterSpacing = 20;
var letterWidth = 15;

var animate;
var allLetters = [];
var wordArray = [];
var UPDATEINTERVAL = 10; //ms

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// canvas stuff that runs on page load
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// begin update cycle
// call this on page load
startAnimatingCanvas();

// call when a new word is displayed on canvas
// start game
// skip word
// ??
initializeCanvasWithANewWord('OCEAN COMMOTION');



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              input checker functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//CREATE VARIABLES
var scrambleSubmission = document.getElementById("scramble-submit");
var input = document.getElementById("input");

//FUNCTION FOR FORM CLEARING
function clearInput() {
  input.value = "";
}

//FORM SUBMISSION
var handleScrambleSubmission = function (event) {
  // console.log(`the user submitted an answer`);
  //event.preventDefault();
  if (input.value === '') {
    handleWiggleButton(); // add wiggle
    document.getElementById('alerts').innerHTML = 'Field cannot be empty';
    //check for correct word
  } else if (input.value === shuffledList[roundCount].toUpperCase()) {
    //this will need to be updated for final version to reflect word scramble code setup
    document.getElementById('alerts').innerHTML = `We're happy as a clam that you guessed ${
      input.value} correctly!`;
    clearInput();
    addTime();
    calcScore();
    updateScoreCounter();
    roundCount++;
    currentWordScramble = scrambledWord(roundCount).toUpperCase();
    initializeCanvasWithANewWord(currentWordScramble);
    resetFocus();
    // console.log(shuffledList[roundCount]);

  } else if (checkAnagram(input.value)) {
    handleWiggleButton(); // add wiggle
    document.getElementById('alerts').innerHTML = `We know you're feeling salty that we didn't accept ${input.value}. Try something with an Oceanic theme.`;
    clearInput();
    resetFocus();
  } else if (input.value !== shuffledList[roundCount].toUpperCase()) {
    handleWiggleButton(); // add wiggle
    document.getElementById('alerts').innerHTML = `Nice try, but ${input.value} didn't seal the deal.`;

    clearInput();
    resetFocus();
  }
};

//ADD EVENT LISTENER

function activateSubmission() {
  scrambleSubmission.addEventListener('click', handleScrambleSubmission);
  input.addEventListener('keyup', function (e) {
    if (e.which === 13) {
      handleScrambleSubmission();
      event.preventDefault();
    }
  });
}

function deactivateSubmission() {
  scrambleSubmission.removeEventListener('click', handleScrambleSubmission);
  document.getElementById('input').disabled = true;
}

function activateSkip(){
  document.getElementById('skipWord').addEventListener('click', skipWord);
}

function deactivateSkip() {
  document.getElementById('skipWord').removeEventListener('click', skipWord);
  document.getElementById('skipWord').disabled = true;
}

document.onkeydown = function (e) {
  if (e.which === 39) {
    skipWord();
  }
};

function forceKeyPressUppercase(e) {
  var charInput = e.keyCode;
  if (charInput >= 97 && charInput <= 122) {
    // lowercase
    if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKEY) {
      // no modifier key
      var newChar = charInput - 32;
      var start = e.target.selectionStart;
      var end = e.target.selectionEnd;
      e.target.value =
        e.target.value.substring(0, start) +
        String.fromCharCode(newChar) +
        e.target.value.substring(end);
      e.target.setSelectionRange(start + 1, start + 1);
      e.preventDefault();
    }
  }
}

document.getElementById("input").addEventListener("keypress", forceKeyPressUppercase, false);
document.getElementById("input").addEventListener("keypress", forceKeyPressUppercase, false);

var shuffledList = [];

//shuffles an array into another array
//array.shuffle(arry)
Array.prototype.shuffle = function (array1) {
  this.splice(0, this.length); // clear all items in this array
  var array2 = array1.slice(0); // make a copy of array1 in array2

  while (array2.length > 0) {
    var i = Math.floor(Math.random() * array2.length); //i = random index of arry
    this.push(array2[i]); //add array2[i] to this
    array2.splice(i, 1); //cut i from array2
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              Shuffle/scramble
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
shuffledList.shuffle(wordList);

//returns a scrambled word, takes in roundNumber as an argument;
function scrambledWord(roundNumber) {
  var word = shuffledList[roundNumber];
  var letterArray = Array.from(word);
  var shuffledWord = [];

  //scramble until shuffledWord is different from letterArray
  //TODO: add another case to make sure it is't the same scramble
  // currentWordScramble
  do {
    shuffledWord.shuffle(letterArray);
    shuffledWord = shuffledWord.join(''); //turn into string for the check
  } while (shuffledWord === word);  
  {
    shuffledWord = shuffledWord.split(''); //turn into array
    shuffledWord.shuffle(letterArray);    //reshuffle
    shuffledWord = shuffledWord.join(''); //turn into string for the check
  }
  return shuffledWord;
}

function displayNewWord() {
  var scramP = document.getElementById("scrambleP");
  scramP.innerHTML = scrambledWord(roundCount).toUpperCase();
}

function checkAnagram(altWord) {
  if (anagramList.includes(altWord.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

function calcScore() {
  endGameScore[0] += shuffledList[roundCount].length;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              Restart button
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function restartGame() {
  var restartResult = window.confirm('Are you sure you want to restart the game and lose your current score?');
  if (restartResult === true){
    window.location.href = 'game.html';
  }
}

function activateRestart() {
  var restartGameButton = document.getElementById('restartGame');
  restartGameButton.addEventListener('click', restartGame);
  unHide(document.getElementById('restartGame'));
}

// ++++++++++++++++++ EXECUTABLES +++++++++++++++++++

//++++++++++++ end game sequence +++++++++++++++++


function endGameDataCollection() {
  document.getElementById('scrambleP').style.display = 'none';
  var pEl = document.createElement('p');
  pEl.setAttribute('id', 'endGameP');
  pEl.textContent = `Whale played! You got a score of ${endGameScore[0]}! Submit your name to see if you're the biggest fish in the sea.`;
  document.getElementById('gameSpace').appendChild(pEl);

  createEndGame();
}

function createEndGame() {
  var gameSpace = document.getElementById('gameSpace');

  var inputEl = document.createElement('input');
  inputEl.setAttribute('id', 'userName');
  inputEl.setAttribute('name', 'userName');
  inputEl.setAttribute('maxlength', '10');
  inputEl.textContent = '';
  gameSpace.appendChild(inputEl);

  var submitEl = document.createElement('button');
  submitEl.setAttribute('id', 'submit-score');
  submitEl.textContent = 'Submit Score';
  gameSpace.appendChild(submitEl);

  var pEl = document.createElement('p');
  pEl.setAttribute('id', 'end-game-alert');
  pEl.textContent = '';
  gameSpace.appendChild(pEl);

  activateEndGameInput();
}

function activateEndGameInput() {
  var submitEl = document.getElementById('submit-score');
  var inputEl = document.getElementById('userName');

  submitEl.addEventListener('click', handleSubmitScore);
  inputEl.addEventListener('keyup', function (e) {
    if (e.which === 13) {
      handleSubmitScore();
    }
  });
}

function handleSubmitScore(event) {
  // event.preventDefault();
  var inputEl = document.getElementById('userName');

  var name = inputEl.value;
  if (name === '') {
    document.getElementById('end-game-alert').innerHTML = 'Field cannot be empty';
  } else {
    endGameScore.unshift(name);
    localStorage.setItem('endGameScore', JSON.stringify(endGameScore));
    window.location.href = 'score.html';
  }
}

function createScoreCounter() {
  var gameSpace = document.getElementById('gameSpace');

  var h2El = document.createElement('h2');
  h2El.setAttribute('id', 'current-score');
  h2El.textContent = endGameScore[0];
  gameSpace.appendChild(h2El);
}

function updateScoreCounter() {
  document.getElementById('current-score').innerHTML = endGameScore[0];
}