'use strict';

var html = document.getElementsByTagName('html')[0];
// html.style.position = 'relative';

var bubbleCanvasEl = document.createElement('canvas');

// style the canvas
var bubbleCanvasWidth = 2000;
var bubbleCanvasHeight = 2000;
bubbleCanvasEl.setAttribute('width', bubbleCanvasWidth);
bubbleCanvasEl.setAttribute('height', bubbleCanvasHeight);
bubbleCanvasEl.style.position = 'fixed';
bubbleCanvasEl.style.top = '0';
bubbleCanvasEl.style.left = '0';
bubbleCanvasEl.style.zIndex = '-1';
bubbleCanvasEl.style.float = 'left';


// add it to the DOM
html.appendChild(bubbleCanvasEl);

// create context
var bubbleCtx = bubbleCanvasEl.getContext('2d');

var screenWidth = document.documentElement.clientWidth;
var screenHeight = document.documentElement.clientHeight;

var bubbleUpdateInterval = 16; // ms
var allBubbles = [];
var time = 0;
var bubbleRate = 200; // lower is more bubbles



function Bubble(x,y) {

    // this.radius = Math.floor(Math.random()*50)+10; 

    // pick a random size
    var max = 100;
    var min = 10;
    this.radius = Math.floor(Math.random()*(max-min))+min; 
    
    // re roll the top half
    if (this.radius > (max * 0.5) ){
        this.radius = Math.floor(Math.random()*(max-min))+min; 
    }

    // re-roll the top third
    if (this.radius > (max * 0.75)){
        // re-roll
        this.radius = Math.floor(Math.random()*(max-min))+min; 
    }

    // re-roll the top 90%
    if (this.radius > (max * 0.9)){
        // re-roll
        this.radius = Math.floor(Math.random()*(max-min))+min; 
    }

    this.xPosition = x;
    this.yPosition = y + 100;
  
    this.xSpeed = 0;
    this.ySpeed = (1 / this.radius)*25;

    this.age = 0;

    allBubbles.push(this);
}

Bubble.prototype.update = function() {
    // this.age++;

    this.yPosition -= this.ySpeed;

    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;

}

Bubble.prototype.draw = function() {

    var dimFactor = 0.25;
    bubbleCtx.fillStyle = `rgba(138, 249, 255, ${0.5*dimFactor})`;
    bubbleCtx.beginPath();
    
    bubbleCtx.lineWidth = 0;
    bubbleCtx.arc(this.xPosition,this.yPosition,this.radius,0,2*Math.PI);
    bubbleCtx.fill();
    
    bubbleCtx.fillStyle = `rgba(255, 255, 255, ${0.5*dimFactor})`;
    bubbleCtx.beginPath();
    bubbleCtx.lineWidth = 0;
    bubbleCtx.arc(this.xPosition,this.yPosition,this.radius*0.8,0,2*Math.PI);
    bubbleCtx.fill();
    
    bubbleCtx.strokeStyle = `rgba(245, 245, 245, ${1*dimFactor})`;
    bubbleCtx.beginPath();
    bubbleCtx.lineWidth = this.radius/10;
    bubbleCtx.lineCap = "round";
    bubbleCtx.arc(this.xPosition,this.yPosition,this.radius*0.65,210/360*2*Math.PI,217/360*2*Math.PI);
    bubbleCtx.stroke();
    
    bubbleCtx.strokeStyle = `rgba(245, 245, 245, ${1*dimFactor})`;
    bubbleCtx.beginPath();
    bubbleCtx.lineWidth= this.radius/6;
    bubbleCtx.lineCap="round";
    bubbleCtx.arc(this.xPosition,this.yPosition,this.radius*0.65,240/360*2*Math.PI,271/360*2*Math.PI);
    bubbleCtx.stroke();

}


function whenThePageLoads(){
    
    convertParsedObjectsToBubbleObjects();

    setInterval(drawBubbleCanvas, bubbleUpdateInterval);

}

function convertParsedObjectsToBubbleObjects() {

    // if no bubble data, return
    if (localStorage.getItem('bubArray') === null){
        return;
    }

    var unparsedBubArray = localStorage.getItem('bubArray');
    var parsedBubArray = JSON.parse(unparsedBubArray);
    // console.table(parsedBubArray);
    var tempBubbleHolder = parsedBubArray;

    // create a set of new bubbles
    // these will automatically get added to the allBubbles array
    for (var i = 0; i < tempBubbleHolder.length; i++){
        var bubFromStorage = tempBubbleHolder[i];

        // create a bubble that will have its values re-assigned
        var newBub = new Bubble(2000,2000);

        newBub.xPosition = bubFromStorage.xPosition;
        newBub.yPosition = bubFromStorage.yPosition;
        newBub.radius = bubFromStorage.radius;
        newBub.age = bubFromStorage.age;
        newBub.xSpeed = bubFromStorage.xSpeed;
        newBub.ySpeed = bubFromStorage.ySpeed;
    }

}

// drawCanvas , called constantly
function drawBubbleCanvas() {
    
    time += 1;

    // add bubbles every t% add interval
    if (time % bubbleRate === 0) {

        var newX = Math.floor(Math.random()*document.documentElement.clientWidth);
        var newY = document.documentElement.clientHeight + 25;
        
        new Bubble(newX, newY);

    }

    // clear canvas
    bubbleCtx.fillStyle = "rgb(51, 134, 167)";
    bubbleCtx.fillRect(0,0,bubbleCanvasEl.width,bubbleCanvasEl.height);
  
    // draw and update all bubbles
    for (var i = 0; i < allBubbles.length; i++){

        // draw the bubble
        allBubbles[i].draw();

        //update the bubble position
        allBubbles[i].update();
    }

    // cull the bubbles
    if (allBubbles.length > 50){
        allBubbles.shift();
    }

    // add the bubbles array into local storage
    var stringifyBubbles = JSON.stringify(allBubbles);

    // remove existing bub data
    if (localStorage.getItem('bubArray' === null)){
        localStorage.removeItem('bubArray');
    }

    localStorage.setItem('bubArray', stringifyBubbles);
    
}

whenThePageLoads();
