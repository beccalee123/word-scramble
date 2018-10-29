'user strict';

var startButton = document.getElementById('start').addEventListener('click', start);
var stopButton = document.getElementById('stop').addEventListener('click', stop);

var timer;
var timeElapsed = 0;

function start() {
    console.log('start was clicked');

    // start timer
    timer = setInterval(timerCallback, 1000);
}

function stop() {
    console.log('stop was clicked');
    
    // stop timer
    clearInterval(timer);
}


function timerCallback() {
    timeElapsed++;
    document.getElementById('time').textContent = `timeElapsed: ${timeElapsed}`;

    console.log('timeElapsed: ',   timeElapsed);
}



var time = document.getElementById('time');


var date;


