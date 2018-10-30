'user strict';

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('stopTimer').addEventListener('click', stopTimer);
document.getElementById('addTime').addEventListener('click', addTime);
document.getElementById('subTime').addEventListener('click', subTime);
document.getElementById('resetTimer').addEventListener('click', resetTimer);



var timer;  // pointer to setInterval for stopping and starting timer

var updateInterval = 10; // time in ms between renders
var startTime;  // time user begins playing

var initialTimeAllowed = 60 * 2 * 1000; // start time at beginning in ms
var maxTimeAllowed = 60 * 5 * 1000; // max allowed time in ms

var timeLeft = initialTimeAllowed; // remaining time
var bonusTime = 0; // accumulated bonus time in ms
var started = false; // tracks whether the game is started for initial render


renderPage();

function resetTimer() {
  bonusTime = 0;
  startTime = Date.now();
  renderPage();
}

function startTimer() {

  if (!started) {
    startTime = Date.now();
  }

  started = true;

  timer = setInterval(renderPage, updateInterval);
}

function stopTimer() {
  clearInterval(timer);
}

function addTime() {
  bonusTime = bonusTime + 15000;
  renderPage();
}

function subTime() {
  bonusTime = bonusTime - 15000;
  renderPage();
}

function renderPage() {

  // if not started render 0 sec time elapsed
  var timeElapsed;
  if (started) {
    timeElapsed = Date.now() - startTime;
  } else {
    timeElapsed = 0;
  }
  timeLeft = initialTimeAllowed - timeElapsed + bonusTime;

  // if timeLeft > maxTimeAllowed, set timeLeft to be maxTimeAllowed
  if (timeLeft > maxTimeAllowed) {
    // calculate extra bonus time
    var extraBonusTime = timeLeft - maxTimeAllowed;

    //remove the exess bonus time
    bonusTime = bonusTime - extraBonusTime;

    // cap time left
    timeLeft = maxTimeAllowed;
  }

  if (timeLeft <= 0) {
    // console.log('timeLeft <= 0');
    stopTimer()
    timeLeft = 0;
  }

  document.getElementById('time').textContent = `timeLeft: ${timeLeft / 1000}`;

  // time bar
  document.getElementById('timerBar').style.width = `${(timeLeft / maxTimeAllowed) * 600}px`;
  document.getElementById('timerBar').textContent = `${timeLeft}`;

  // bonus bar
  document.getElementById('bonusBar').style.width = `${(bonusTime / maxTimeAllowed) * 600}px`;
  document.getElementById('bonusBar').textContent = `${bonusTime}`;

}


// ~~~~~~~~~~~~~ Timer 2 for testing ~~~~~~~~~~~~

document.getElementById('startTimerTwo').addEventListener('click', startTimerTwo);

var startTimeTwo;
var startedTwo = false;
var timeLeftTwo = 120000;
var startedTwo = false;

function startTimerTwo() {

  if (!startedTwo) {
    startTimeTwo = Date.now();
  }

  startedTwo = true;

  timerTwo = setInterval(renderPageTwo, updateInterval);
}

function renderPageTwo(){

  // if not started render 0 sec time elapsed
  var timeElapsedTwo;
  if (startedTwo) {
    timeElapsedTwo = Date.now() - startTimeTwo;
  } else {
    timeElapsedTwo = 0;
  }
  timeLeftTwo = initialTimeAllowed - timeElapsedTwo;

  // time bar
  document.getElementById('timerBar2').style.width = `${(timeLeftTwo / maxTimeAllowed) * 600}px`;
  document.getElementById('timerBar2').textContent = `${timeLeftTwo}`;


}



// setInterval(callback function, interval in ms)
// cons: deviates over time
// date
// cons: manipulatable by user
// performance.now()
// seems perfect, but needs Web Workers
// window.requestAnimationFrame(add)
// needs investigating