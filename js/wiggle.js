'use strict';

document.getElementById('stop').addEventListener('click', stopAnimate);
document.getElementById('start').addEventListener('click', startAnimate);

var animate;

var word = 'test';
var wordArray = [];

for (var i = 0; i < word.length; i++){
    wordArray[i] = word[i];
    // console.log('wordArray: ', wordArray);
}



// create canvas
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext("2d");
ctx.font = "2em monospace";

// https://codepen.io/tholman/pen/lDLhk?editors=1010
// call update
function startAnimate() {
    // one time function cals
    animate = setInterval(update, 50); // call update every 100ms
}

// stop animation
function stopAnimate(){
    clearInterval(animate);
}

// clear canvas to white background
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvasEl.width,canvasEl.height);
}

// update function , called constantly
function update() {
    
    clearCanvas();
    // for each letter
    for (var i = 0; i < allLetters.length; i++){
        // draw the letter
        allLetters[i].draw();
        //update the letter position
        // allLetters[i].update();
    }
}

// create letters
// create letter objects
var allLetters = [];
for (var i = 0; i < wordArray.length; i++){
    new Letter(wordArray[i]);
}

// call this function to render the letters initially
function renderInitial(){
    var numLetters = wordArray.length;
    var letterSpacing = 25;

    var wordTopLeftX = 50;
    var wordTopLeftY = 20;
    for (var i = 0; i < allLetters.length; i++){
        // set initial position
        // console.log('wordArray[i].xInitial: ', wordArray[i].xInitial);
        // console.log('wordTopLeftX + letterSpacing * i: ', wordTopLeftX + letterSpacing * i);
        allLetters[i].xInitial = wordTopLeftX + letterSpacing * i;
        allLetters[i].yInitial = wordTopLeftY;
        allLetters[i].initialize();
    }
}


function Letter(letter) {
    this.letter = letter;
    this.xPosition;
    this.yPosition;
    this.xSpeed = 2;
    this.ySpeed;
    this.xAcceleration;
    this.yAcceleration;

    this.xInitial = 0;
    this.yInitial;

    allLetters.push(this);
}

Letter.prototype.wiggle = function() {
    // TODO: add function to wiggle
    console.log(`Wiggle called on ${this.letter}`);
}

Letter.prototype.move = function(startX, startY, endX, endY) {
    // TODO: add function to move the letter
    console.log(`move called on ${this.letter}`);
}

Letter.prototype.draw = function() {
    // TODO: add function to draw the letter
    // set the letter color
    ctx.fillStyle = "black";

    // draw the letter at current position
    ctx.fillText(`${this.letter}`, this.xPosition, this.yPosition);

    console.log(`draw called on ${this.letter}`);
}

Letter.prototype.update = function() {
    // TODO: add function to increment position
    console.log(`updated called on ${this.letter}`);

    if (this.xPosition <= 100 ){
        this.xPosition += this.xSpeed;
        
    } else {
        this.xSpeed = this.xSpeed * -1;
    }
}

Letter.prototype.initialize = function() {
    console.log(`initialize called on ${this.letter}`);
    this.xPosition = xInitial;
    this.yPosition = yInitial;
}

renderInitial();
