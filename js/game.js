'use strict';

var roundCount;
var endGameScore = [0];



// notification on page leave
window.addEventListener('beforeunload', function(e) {
  return 'dummy text';
});

// change nav item color
document.getElementsByTagName('li')[1].style.backgroundColor = 'lightblue';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('skipWord').addEventListener('click', skipWord);

// document.getElementById('addTime').addEventListener('click', addTime);
// document.getElementById('resetTimer').addEventListener('click', resetTimer);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              timer functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function skipWord() {
  clearInput();
  subTime();
  roundCount++;
  displayNewWord();
}

function startGame() {
  startTimer();
  roundCount = 0;

  displayNewWord();
  activateSubmission();
}

function endGame() {
  deactivateSubmission();
  
  //localStorage setItem score
  //prompt user info
  //reset/restart button
}

function resetTimer() {
  // disable interval function calls
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
  // if ()
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
  document.getElementById("timerBar").style.width = `${(timeLeft /
    maxTimeAllowed) *
    600}px`;
  document.getElementById("timerBar").textContent = `${timeLeft / 1000}`;
}

renderTimer();

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
var handleScrambleSubmission = function(event) {
  console.log(`the user submitted an answer`);
  //event.preventDefault();
  //prevent empty fields
  if (input.value === '') {
    document.getElementById('alerts').innerHTML = 'Field cannot be empty';
    //check for correct word
  } else if (input.value === shuffledList[roundCount].toUpperCase()) {
    //this will need to be updated for final version to reflect word scramble code setup
    document.getElementById('alerts').innerHTML = `${
      input.value
    } was the correct word - good job!`;
    clearInput();
    addTime();
   calcScore(); 
   roundCount++;
    displayNewWord();
    
    console.log(shuffledList[roundCount]);
    
    //TODO: Add functionality to add to score tally based on number of letters in word
  } else if (checkAnagram(input.value)) {
    document.getElementById('alerts').innerHTML = `${
      input.value
    } is a real word, but we're looking for something with an Ocean theme.`;
    clearInput();
  } else if (input.value !== shuffledList[roundCount].toUpperCase()) {
    document.getElementById('alerts').innerHTML = `Nice try, but ${
      input.value
    } is not correct. Try again!`;
    clearInput();
  }
};

//ADD EVENT LISTENER

function activateSubmission() {
  scrambleSubmission.addEventListener('click', handleScrambleSubmission);
  input.addEventListener('keyup', function(e) {
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

document
  .getElementById("input")
  .addEventListener("keypress", forceKeyPressUppercase, false);
document
  .getElementById("input")
  .addEventListener("keypress", forceKeyPressUppercase, false);

var shuffledList = [];

//shuffles an array into another array
//array.shuffle(arry)
Array.prototype.shuffle = function(array1) {
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
  do {
    shuffledWord.shuffle(letterArray);
  } while (shuffledWord === letterArray);
  {
    shuffledWord.shuffle(letterArray);
  }
  shuffledWord = shuffledWord.join('');
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
  console.log(shuffledList[roundCount].length);
  endGameScore[0] += shuffledList[roundCount].length;
}

function collectUsername() {
  var name = 'dummy name';
  endGameScore.unshift(name);
}

// ++++++++++++++++++ EXECUTABLES +++++++++++++++++++

