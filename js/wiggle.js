'use strict';

document.getElementById('stop').addEventListener('click', stopAnimate);
document.getElementById('start').addEventListener('click', startAnimatingCanvas);
document.getElementById('wiggle').addEventListener('click', handleWiggleButton);
// document.getElementById('move').addEventListener('click', handleMoveButton);
document.getElementById('swap').addEventListener('click', handleSwapButton);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~ letter constructor ~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Letter(letter) {
    this.letter = letter;
    this.xPosition;
    this.yPosition;
    this.xSpeed;
    this.ySpeed;

    this.xInitial = 0;
    this.yInitial = 0;

    this.xMoving = false;
    this.yMoving = false;
    this.xDestination;
    this.yDestination;

    this.wiggling = false;
    this.wiggleCount;

    this.ySwapping = false;
    this.xSwapping = false;

    allLetters.push(this);

    // TODO: implement wave functionality 
    //this.age
}

Letter.prototype.rand = function(min, max) {
    // credit https://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
    // TODO: add this credit to the readme.md ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var rand = (Math.floor(Math.random()*(max-min))+2) * (Math.random() < 0.5 ? -1 : 1);
    return rand;
}

Letter.prototype.wiggle = function() {
    // a wiggle is a short move to a random place close by

    var max = 7; 
    var min = 3;

    var randomX = this.rand(min, max);
    var randomY = this.rand(min, max);

    // confine the random number to be within 10px of the initial position
    var close = false;
    while (!close){

        // calculate move distance
        var xDistFromHome = (this.xPosition + randomX) - this.xInitial;
        var yDistFromHome = (this.yPosition + randomY) - this.yInitial;

        if (Math.abs(xDistFromHome) < 7 && Math.abs(yDistFromHome) < 7){
            close = true;
        } else {
            randomX = this.rand(min, max);
            randomY = this.rand(min, max);
        }
    }

    this.assignMove(this.xPosition + randomX, this.yPosition + randomY);
}

Letter.prototype.assignWiggle = function() {

    this.wiggleCount = 4;
    this.wiggling = true;
    this.xMoving = true;
    this.yMoving = true;

}

Letter.prototype.assignMove = function(endX, endY) {

    this.xMoving = true;
    this.yMoving = true;
    this.xDestination = endX;
    this.yDestination = endY;
    
}

Letter.prototype.assignSwap = function(endX, endY) {

    this.xSwapping = true;
    this.ySwapping = true;

    this.xMoving = true;
    this.yMoving = true;

    this.xDestination = endX;
    this.yDestination = endY;
    
}

Letter.prototype.draw = function() {

    // set the letter color
    ctx.fillStyle = "black";

    // draw the letter at current position
    ctx.fillText(`${this.letter}`, this.xPosition, this.yPosition);

}

Letter.prototype.incrementPosition = function() {
    var xDistance = this.xDestination - this.xPosition;
    var yDistance = this.yDestination - this.yPosition;

    // x motion for all moves
    if (Math.abs(xDistance) > 1 ) {
        this.xPosition = this.xPosition + this.xSpeed * Math.sign(xDistance);
    } else {
        // destination reached
        this.xMoving = false;
        this.xPosition = this.xDestination; // snap to destination
    }

    // y motion when wiggling
    if (this.wiggling){
        if (Math.abs(yDistance) > 1 ) {
            this.yPosition = this.yPosition + this.ySpeed * Math.sign(yDistance);
        } else {
            // destination reached
            this.yMoving = false;
            this.yPosition = this.yDestination; // snap to destination
        }
    }

    // y motion when swapping
    if (this.ySwapping){
        if (Math.abs(xDistance) > 1 ) {
            this.yPosition = this.yPosition + this.ySpeed;
        } else {
            // destination reached
            this.yMoving = false; // stop moving
            this.yPosition = this.yDestination; // snap to desired destination
        }
    }


}

Letter.prototype.executeWiggleLogic = function() {

    // decrement wiggles
    this.wiggleCount--;

    // if it still has more wiggling to do
    if (this.wiggleCount > 0) {
        this.wiggle();
    }
        
    // if it is done with all wiggles
    if (this.wiggleCount === 0) {
        this.xMoving = false;
        this.yMoving = false;
        this.assignMove(this.xInitial,this.yInitial); // return home
    }

    // if it has arrived at home, toggle off wiggle
    if (this.xPosition === this.xInitial && this.yPosition === this.yInitial && !this.wiggling){
        this.wiggling = false;
    }
}

Letter.prototype.calcSwapYVelocity = function() {

    // if swapping
    // y speed is a function of the remaining X distance
    // if x distance < 50 %, y velocity is upwards
    // if x distance > 50 %, y velocity is downwards

    // for triangular motion, y velocity is constant 
    // for circular motion, y velocity scales with x distance

    // x -------.-------->
    // y .              .
    //    .           .
    //          ^
    // max displacement = xDistance total travel * 1 (1 for circular motion)
    // 
    // for circular things trig functions can come in handy
    // For y velocity: at the start, we will use  cos(0) = 1 (Fast increasing Y)
    // For y velocity: at the middle, we will use cos(90) = 0 (sign change on Y)
    // For y velocity: at the end, we will use    cos(180) = -1 (Fast decreasing Y)
    // to calculate the "angle" to feed our cos, we need to convert X distance
    // "angle", or X positin, goes from 0 at start to 180 at end
    // we can calculate the % from 0 to 100% that x is on on it's journey
    // using: % trip completed: (this.xPosition - this.xInitial) / totalXTravel
    // to convert 0.0 to 1.0 to 0 to 180, we multiply by 180
    // so at 0% we'll be at 0, at 50% we'll be at 90, and 100% we'lll be at 180
    // However: JS uses radians, so convert our angle to radians
    // we need to scale 0 to 100, to 0 to pi() , or 3.1415
    // to convert 0.0 to 1.0 to 0 to PI, we multiply by PI

    // yVelocity = Math.cos(angle); <-- this normalized y velocity
    // which ranges from 0 to 1, which is too low
    // so we need to scale it by some arbitrary factor to make the motion visible

    var totalXTravel = this.xDestination - this.xInitial

    // if letter isn't already at it's destination
    if (Math.abs(totalXTravel) > 0) {
        var pctComplete = (this.xPosition - this.xInitial) / totalXTravel;
        var angle = pctComplete * Math.PI; // in radians
        var yScaleFactor = 1;
        var yVelocity = Math.cos(angle) * yScaleFactor;
    } else {
        var yVelocity = 0;
    }

    // apply new velocity to the letter
    this.ySpeed = yVelocity;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// core move logic is this update function
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Letter.prototype.update = function() {
    
    // if swapping
    // disable wiggling, and set speed higher
    if (this.xSwapping || this.ySwapping) {
        this.xSpeed = 1;
        this.calcSwapYVelocity();
        this.wiggling = false;
    }

    // if wiggling, set speed a little slower
    if (this.wiggling) {
        this.xSpeed = 0.5;
        this.ySpeed = 0.5;
    }

    if (this.xMoving || this.yMoving){
        this.incrementPosition(); 
        // NOTE: this can change moving flags but not wiggling or swapping flags
    }

    // if stopped and still wiggling, then it has completed a wiggle
    // begin the next wiggle, until all wiggles are complete
    if (!this.xMoving && !this.yMoving && this.wiggling){
        this.executeWiggleLogic();
    }

    // if stopped and still swapping, then it has completed a swap
    if (this.xMoving === false && this.yMoving === false && this.xSwapping && this.ySwapping){
        this.xSwapping = false;
        this.ySwapping = false;

        // set current position as new home
        // this facilitates wiggling and swapping
        this.xInitial = this.xPosition;
        this.yInitial = this.yPosition;
    }

    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~ global animation variables ~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create canvas
// TODO: is this the best place for this? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext("2d");
ctx.font = "2em monospace";

var animate;
var allLetters = [];
var wordArray = [];
var UPDATEINTERVAL = 10; //ms

var word = 'abcdefghij'; // TODO: integrate with new word functionality ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~ stuff that runs ~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// begin update cycle
// call this on page load
startAnimatingCanvas();


// call when a new word is displayed on canvas
// start game
// skip word
// ??
initializeCanvasWithANewWord(word);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~   functions     ~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initializeCanvasWithANewWord(word){

    // convert word into an array of letters for easier handling
    for (var i = 0; i < word.length; i++){
        wordArray[i] = word[i];
    }

    // instantiate letter objects
    for (var i = 0; i < wordArray.length; i++){
        new Letter(wordArray[i]);
    }

    // single call to display the letters in their initial position
    renderInitial();

    // wait
}

// call update
function startAnimatingCanvas() {
    // one time function calls
    animate = setInterval(drawCanvas, UPDATEINTERVAL); // call update every __ms
}

// drawCanvas , called constantly
function drawCanvas() {
    
    clearCanvas();
    // for each letter
    for (var i = 0; i < allLetters.length; i++){

        // draw the letter
        allLetters[i].draw();

        //update the letter position
        allLetters[i].update();
    }
}

// clear canvas to white background , called constantly
// TODO: confirm with the group on whether we want a pure white background or not ~~~~~~~~~~~~~~~
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvasEl.width,canvasEl.height);
}

// stop animation
// TODO: hook up to a button on the game page? is this function ever called when not in testing? ~~~~~~~~~~~~~~~
// maybe called on game over
function stopAnimate(){
    clearInterval(animate);
}

// call this function to render the letters initially
// TODO: eventually replace this with rippling letters spelling ' ocean commotion '
function renderInitial(){

    // canvas height
    var canvasHeight = document.getElementsByTagName('canvas')[0].height;

    // Y is about the middle of the canvas
    var wordY = canvasHeight/2 + 8;

    // get X coords
    var letterXCoordinates = generateXCoordinates(wordArray.length);

    for (var i = 0; i < allLetters.length; i++){

        // set initial position
        allLetters[i].xInitial = letterXCoordinates[i];
        allLetters[i].yInitial = wordY;

        // immediately set x and y position to initial positions
        allLetters[i].xPosition = allLetters[i].xInitial;
        allLetters[i].yPosition = allLetters[i].yInitial;

        allLetters[i].draw();
    }
}

function handleWiggleButton() {

    var isMidSwap = false;
    for (var i = 0; i < allLetters.length; i++){
        if (allLetters[i].xSwapping || allLetters[i].ySwapping){
            isMidSwap = true;
        }
    }

    if (!isMidSwap) {
        for (var i = 0; i < allLetters.length; i++){
            allLetters[i].assignWiggle();
            allLetters[i].wiggle(); // assigns a move
        }
    }    
}

// TODO: link this to the button that exists on the game page, rather than the one that is on the testing page ~~~~~~~~~~~~~~~
function handleSwapButton(){
    
    // is it already swapping?
    var swapIsUnderWay = false;
    for (var i = 0; i < allLetters.length; i++){
        if (allLetters[i].xSwapping === true || allLetters[i].ySwapping === true){
            swapIsUnderWay = true;
        }
    }

    // if not already swapping, initiate a swap
    if (!swapIsUnderWay){
        // get current word
        //TODO: replace this retrieving of current word with something that references the actual word, UNSCRAMBLED ~~~~~~~~~~~~~~~
        var currentWord = word; 

        // scramble
        //TODO: replace scramble with something that is returned from the existing scramble function ~~~~~~~~~~~~~~~
        var scramble = scrambleWord(currentWord, currentWord);

        // initiate swap
        initiateSwap(scramble);
    }
}

// take a swap command and convert it into a move command for each letter
function initiateSwap(newScramble) {
    var newScrambleArray = []
    for (var i = 0; i < newScramble.length; i++){
        newScrambleArray[i] = newScramble[i];
    }
    
    // iterate thru the wordArray and generate new index positions
    var newIndexes = [];
    for (var i = 0; i < wordArray.length; i++){

        // find the index of the letter in the new word
        var currentLetter = wordArray[i];

        // newIndex is the index of the current letter in the new array
        var newIndex = newScrambleArray.indexOf(currentLetter);

        // save the new index in the array that keeps track of new positions
        newIndexes[i] = newIndex;

        // remove instance of that letter, -1 will never be in any letter
        // because indexOf returns the first instance of the thing in the array
        newScrambleArray[newIndex] = -1;
    }
    
    // generate new X Y positions
    var xCoords = generateXCoordinates(newScramble.length);

    // assign moves to new X Y positions
    for (var i = 0; i < allLetters.length; i++){

        // this is where the magic happens
        var newX = xCoords[newIndexes[i]];

        // y doesn't ever change
        var newY = allLetters[i].yInitial;

        // command the move
        allLetters[i].assignSwap(newX, newY);
    }

}

// given a word length, returns an array of canvas-centered,
// evenly spaced X coordinates
function generateXCoordinates(numLetters){
    
    var coordArray = [];
    // TODO: is this the best way to retrieve the canvas element?
    var canvasWidth = document.getElementsByTagName('canvas')[0].width;
    var letterSpacing = 10;
    var letterWidth = 10;
    var spacing = letterSpacing + letterWidth;
    var wordLength = (spacing * numLetters) - letterSpacing;

    // word start X
    var wordStartX = (canvasWidth / 2) - (wordLength / 2)

    // calculate word positions and fill array
    for (var i = 0; i < numLetters; i++){
        coordArray[i] = wordStartX + spacing * i;
    }

    return coordArray;
}








// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~ scramble word ~~~~~~~~~~~~~ // TODO: replace with calls to existing scramble functions ~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// takes a string, and returns a string that is scrambled
// string will not be equal to the original or the forbidden word
function scrambleWord(inputWord, forbiddenWord){
    
    if (inputWord.length !== forbiddenWord.length){
        console.log('serious issues');
    }

    var outputWord = '';
    var outputWordArray = [];

    var count = 0;

    var matchesInputWord = true;
    var matchesForbiddenWord = true;
    while (matchesInputWord && matchesForbiddenWord){

        // convert to an array
        var inputWordArray = [];
        for (var i = 0; i < inputWord.length; i++){
            inputWordArray[i] = inputWord[i];
        }

        // fill the array
        for (var i = 0; i < inputWord.length; i++){
            // guess a random array index
            var randIndex = calcRand(inputWordArray.length);

            // save the letter
            var currentLetter = inputWordArray[randIndex];

            // and remove it from the input array
            inputWordArray.splice(randIndex,1);

            // put it into the new array
            outputWordArray[i] = currentLetter;
        }

        // check for random output matches input word
        for (var i = 0; i < outputWordArray.length; i++){
            if (outputWordArray[i] !== inputWord[i]){
                matchesInputWord = false;
            }
        }

        // check for random output matches input word
        for (var i = 0; i < outputWordArray.length; i++){
            if (outputWordArray[i] !== inputWord[i]){
                matchesForbiddenWord = false;
            }
        }
    }

    // convert the array into a string
    for (var i = 0; i < outputWordArray.length; i++){
        outputWord += outputWordArray[i];
    }

    return outputWord;
}

// returns random integer between 0 thru max-1
// pass word length if scrambling a word
function calcRand(max) {

    var randomInteger = Math.floor(Math.random()*max);;

    return randomInteger;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



