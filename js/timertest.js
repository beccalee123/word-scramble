'user strict';

var startButton = document.getElementById('start').addEventListener('click', startTimer);
var stopButton = document.getElementById('stop').addEventListener('click', stopTimer);
var stopButton = document.getElementById('add').addEventListener('click', add);
var stopButton = document.getElementById('sub').addEventListener('click', sub);

var timer;  // pointer to setInterval for stopping and starting timer

var updateInterval = 10; // time in ms between renders
var startTime;  // time user begins playing

var initialTimeAllowed = 60 * 2 * 1000; // start time at beginning in ms
var maxTimeAllowed = 60 * 5 * 1000; // max allowed time in ms

var timeLeft = initialTimeAllowed; // remaining time
var bonusTime = 0; // accumulated bonus time in ms
var started = false; // tracks whether the game is started for initial render


renderPage();

function startTimer() {
  started = true;
  startTime = Date.now();
  timer = setInterval(renderPage, updateInterval);
}

function stopTimer() {
  clearInterval(timer);
}

function add() {
  bonusTime = bonusTime + 15000;
  renderPage();
}

function sub() {
  bonusTime = bonusTime - 15000;
  renderPage();
}

function renderPage() {
  
  // if not ststarted render 0 sec time elapsed
  var timeElapsed;
  if (started) {
    timeElapsed = Date.now() - startTime;
  } else {
    timeElapsed = 0;
  }
  timeLeft = initialTimeAllowed - timeElapsed + bonusTime;

  // if timeLeft > maxTimeAllowed, set timeLeft to be maxTimeAllowed
  if (timeLeft > maxTimeAllowed){
    // calculate extra bonus time
    var extraBonusTime =  timeLeft - maxTimeAllowed;
    
    //remove the exess bonus time
    bonusTime = bonusTime - extraBonusTime;

    // is this line needed?
    // timeLeft = maxTimeAllowed;
  }

  if (timeLeft <= 0){
    // console.log('timeLeft <= 0');
    stopTimer()
    timeLeft = 0;
  }

  document.getElementById('time').textContent = `timeLeft: ${timeLeft/1000}`;
  
  // time bar
  document.getElementById('timerBar').style.width = `${(timeLeft/maxTimeAllowed)*600}px`;
  document.getElementById('timerBar').textContent = `${timeLeft}`;

  // bonus bar
  document.getElementById('bonusBar').style.width = `${(bonusTime/maxTimeAllowed)*600}px`;
  document.getElementById('bonusBar').textContent = `${bonusTime}`;

}






// setInterval(callback function, interval in ms)
// cons: deviates over time
// date
// cons: manipulatable by user
// performance.now()
// seems perfect, but needs Web Workers
// window.requestAnimationFrame(add)
// needs investigating