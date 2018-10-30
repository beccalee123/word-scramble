'use strict';

// notification on page leave
window.addEventListener('beforeunload', function (e) { return 'dummy text'; });

// change nav item color
document.getElementsByTagName('li')[1].style.backgroundColor = 'lightblue';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
document.getElementById('startGame').addEventListener('click', startTimer);
document.getElementById('skipWord').addEventListener('click', subTime);

// document.getElementById('addTime').addEventListener('click', addTime);
// document.getElementById('resetTimer').addEventListener('click', resetTimer);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              timer globals
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var timer;  // pointer to setInterval for stopping and starting timer

var updateInterval = 10; // time in ms between renders
var startTime;  // time user begins playing

var initialTimeAllowed = 60 * 2 * 1000; // start time at beginning in ms
var maxTimeAllowed = 60 * 5 * 1000; // max allowed time in ms

var timeLeft = initialTimeAllowed; // remaining time
var bonusTime = 0; // accumulated bonus time in ms
var penaltyTime = 0; // accumulated time penalty
var started = false; // tracks whether the game is started for initial render



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              timer functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

    // cap bonus time
    var maxBonusTime = maxTimeAllowed - initialTimeAllowed;
    if (bonusTime > maxBonusTime) {
        bonusTime = maxBonusTime;
    }

    renderTimer();
}

function subTime() {
    penaltyTime = penaltyTime + 15000;
    clearInput();
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
        // TODO: add any other game over functions here:
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
    document.getElementById('timerBar').style.width = `${(timeLeft / maxTimeAllowed) * 600}px`;
    document.getElementById('timerBar').textContent = `${timeLeft / 1000}`;

}

renderTimer();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//              input checker functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//TEST WORD
var testWord = 'WORD'
var altWord = 'ALTWORD'

//CREATE VARIABLES
var scrambleSubmission = document.getElementById('scramble-submit');
var input = document.getElementById('input');

//FUNCTION FOR FORM CLEARING
function clearInput() {
  input.value = '';
};

//FORM SUBMISSION
var handleScrambleSubmission = function (event) {
  console.log(`the user submitted an answer`);
  //prevent page reload on submission. Will need to add this back in, but is currently breaking the keyup function.
  //event.preventDefault();
  //prevent empty fields
  if (input.value === '') {
    document.getElementById('alerts').innerHTML = 'Field cannot be empty';
    //check for correct word
  } else if (input.value === testWord) { //this will need to be updated for final version to reflect word scramble code setup
    document.getElementById('alerts').innerHTML = `${input.value} was the correct word - good job!`;
    clearInput();
    //Add functionality to cue up the next word
    //Add functionality to add 15 seconds to timer up to max of 5 min
    addTime();
    //Add functionality to add to score tally based on number of letters in word
  } else if (input.value === altWord) {
    document.getElementById('alerts').innerHTML = `${input.value} is a real word, but we're looking for something with an Ocean theme.`;
    clearInput();
  } else if (input.value !== testWord) {
    document.getElementById('alerts').innerHTML = `Nice try, but ${input.value} is not correct. Try again!`;
    clearInput();
  }
}

//ADD EVENT LISTENER

scrambleSubmission.addEventListener('click', handleScrambleSubmission);
input.addEventListener('keyup', function (e) {
  if (e.which === 13) {
    handleScrambleSubmission();
    event.preventDefault();
  }
});

//ADD FEATURE SO ALL TEXT ENTERED INTO INPUT IS DISPLAYED AS UPPERCASE

// forceKeyPressUppercase function sourced from  https://www.the-art-of-web.com/html/input-field-uppercase/

function forceKeyPressUppercase(e)
  {
    var charInput = e.keyCode;
    if((charInput >= 97) && (charInput <= 122)) { // lowercase
      if(!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKEY) { // no modifier key
        var newChar = charInput - 32;
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        e.target.setSelectionRange(start+1, start+1);
        e.preventDefault();
      }
    }
  }

  document.getElementById('input').addEventListener('keypress', forceKeyPressUppercase, false);
  document.getElementById('input').addEventListener('keypress', forceKeyPressUppercase, false);
