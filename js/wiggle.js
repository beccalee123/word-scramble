'use strict';

document.getElementById('stop').addEventListener('click', stopAnimate);
document.getElementById('start').addEventListener('click', startAnimate);
document.getElementById('wiggle').addEventListener('click', handleWiggleButton);
document.getElementById('move').addEventListener('click', handleMoveButton);

var animate;

var word = 'test';
var wordArray = [];
var UPDATEINTERVAL = 16; //ms

for (var i = 0; i < word.length; i++){
    wordArray[i] = word[i];
    // console.log('wordArray: ', wordArray);
}

// create canvas
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext("2d");
ctx.font = "2em monospace";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~ letter object ~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Letter(letter) {
    this.letter = letter;
    this.xPosition;
    this.yPosition;
    this.xSpeed = 1;
    this.ySpeed = 1;

    this.xInitial = 0;
    this.yInitial = 0;

    this.xMoving = false;
    this.yMoving = false;
    this.xDestination;
    this.yDestination;


    this.wiggleCount;
    this.wiggling = false;

    allLetters.push(this);
}


Letter.prototype.wiggle = function() {
    // console.log(`Wiggle called on ${this.letter}`);

    var max = 7; // dimensions of the wiggle square
    var min = 3;

    // a wiggle is a short move to a random place close by
    // credit https://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
    var randomX = (Math.floor(Math.random()*(max-min))+2) * (Math.random() < 0.5 ? -1 : 1);
    // console.log('randomX: ', randomX);
    var randomY = Math.floor(Math.random()*(max-min))+2 * (Math.random() < 0.5 ? -1 : 1);
    // console.log('randomY: ', randomY);

    this.assignMove(this.xPosition + randomX, this.yPosition + randomY);

}

Letter.prototype.assignWiggle = function() {
    // TODO: add function to generate wiggle
    // console.log(`assignWiggle called on ${this.letter}`);
    this.wiggleCount = 2;
    this.wiggling = true;
    this.xMoving = true;
    this.yMoving = true;

}

Letter.prototype.assignMove = function(endX, endY) {
    // console.log(`assignMove called on ${this.letter}`);

    this.xMoving = true;
    this.yMoving = true;
    this.xDestination = endX;
    this.yDestination = endY;
    

}

Letter.prototype.draw = function() {
    // TODO: add function to draw the letter
    // set the letter color
    ctx.fillStyle = "black";

    // draw the letter at current position
    ctx.fillText(`${this.letter}`, this.xPosition, this.yPosition);

    // console.log(`draw called on ${this.letter}`);
}

Letter.prototype.update = function() {

    console.log('here');
    if (this.xMoving || this.yMoving){
        
        var xDistance = this.xDestination - this.xPosition;
        var yDistance = this.yDestination - this.yPosition;
    

        if (Math.abs(xDistance) > 1 ) {
            this.xPosition = this.xPosition + this.xSpeed * Math.sign(xDistance);
        } else {
            // destination reached
            this.xMoving = false;
            this.xPosition = this.xDestination;
        }

        if (Math.abs(yDistance) > 1 ) {
            this.yPosition = this.yPosition + this.ySpeed * Math.sign(yDistance);
        } else {
            // destination reached
            this.yMoving = false;
            this.yPosition = this.yDestination;
        }

        // if not moving at all, and it is wiggling, then it has completed a wiggle
        var passFail = this.xMoving === false && this.yMoving === false && this.wiggling;
        if (passFail){

            // decrement wiggles
            this.wiggleCount--;

            // if it still has more wiggling to do
            if (this.wiggleCount > 0) {
                this.wiggle();
            }
             
            // if done wiggling
            if (this.wiggleCount === 0) {
                // it is done wiggling
                this.wiggling = false;
                this.xMoving = false;
                this.yMoving = false;
            }
              
            // return home
            if (this.wiggling === false){
                this.assignMove(this.xInitial,this.yInitial);
            }
            
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// instantiate letter objects
var allLetters = [];
for (var i = 0; i < wordArray.length; i++){
    new Letter(wordArray[i]);
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~   functions     ~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function handleWiggleButton() {
    // console.log('wiggle whole word called');

    startAnimate();

    for (var i = 0; i < allLetters.length; i++){
        allLetters[i].assignWiggle();
        allLetters[i].wiggle(); // assigns a move
    }
    
}

function handleMoveButton() {
    // console.log('move button pressed');
    
    startAnimate();

    // call move on each letter
    for (var i = 0; i < allLetters.length; i++){
        // endX, endY
        var xEnd = allLetters[i].xPosition + 50;
        var yEnd = allLetters[i].yPosition + 100;
        allLetters[i].assignMove(xEnd, yEnd);
    }
}


// call update
function startAnimate() {
    // one time function calls
    animate = setInterval(drawCanvas, UPDATEINTERVAL); // call update every __ms
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
function drawCanvas() {
    
    clearCanvas();
    // for each letter
    for (var i = 0; i < allLetters.length; i++){
        // draw the letter
        allLetters[i].draw();
        //update the letter position
        //allLetters[i].xPosition = Math.floor(Math.random()*100);
        allLetters[i].update();
    }
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
        var startX = wordTopLeftX + letterSpacing * i;
        var startY = wordTopLeftY;
        
        // set X start position on new word
        allLetters[i].xInitial = startX;
        allLetters[i].xPosition = startX;
        // console.log('wordArray[i].xInitial: ', wordArray[i].xInitial);

        // set Y start position on new word
        allLetters[i].yInitial = startY;
        allLetters[i].yPosition = startY;
        allLetters[i].draw();
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// single call to display the letters in their initial position
renderInitial();





// pick a position within a square

// move:
// calculate X initial, calculate X final
// over fixed time T, increment X until xPosition = xFinal

// pick a 2nd position within a square
// move:
// calculate X initial, calculate X final
// over fixed time T, increment X until xPosition = xFinal

// pick a 3rd position within a square
// move:
// calculate X initial, calculate X final
// over fixed time T, increment X until xPosition = xFinal

// move back to original position
// move:
// calculate X initial, calculate X final
// over fixed time T, increment X until xPosition = xFinal