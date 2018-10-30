'use strict';

document.getElementById('stop').addEventListener('click', stopAnimate);
var animate;

var word = 'testword';
var wordArray = [];

for (var i = 0; i < word.length; i++){
    wordArray[i] = word[i];
    //console.log('wordArray: ', wordArray);
}

for (var i = 0; i < wordArray.length; i++){
    var liEl = document.createElement('li');
    liEl.textContent = wordArray[i];
    var ulEl = document.getElementsByTagName('ul')[0];
    ulEl.appendChild(liEl);
}

var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext("2d");
ctx.font = "2em monospace";

function update() {
    clear();
    var d = Date.now();
    console.log('d: ', d);
    ctx.fillStyle = "black";
    ctx.fillText(`${d}`, 10, 50);
    //ctx.fill();
    
}

// https://codepen.io/tholman/pen/lDLhk?editors=1010
// call update
function wiggle() {
    animate = setInterval(update, 50); // call update every 100ms
}

// stop animation
function stopAnimate(){
    clearInterval(animate);
}

// clear canvas to white background
function clear() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvasEl.width,canvasEl.height);
}

wiggle();




