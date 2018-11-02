'use strict';

var html = document.getElementsByTagName('html')[0];
// html.style.position = 'relative';

var bubbleCanvasEl = document.createElement('canvas');

// style the canvas
bubbleCanvasEl.setAttribute('width', '2000');
bubbleCanvasEl.setAttribute('height', '2000');
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

var bubbleUpdateInterval = 20; // ms
var allBubbles = [];
var time = 0;
var bubbleRate = 10;

function Bubble(x,y) {

    this.radius = Math.floor(Math.random()*50)+10;

    this.xPosition = x;
    this.yPosition = y;
  
    this.xSpeed = 0;
    this.ySpeed = (1 / this.radius)*100;

    this.age = 0;

    allBubbles.push(this);
}

Bubble.prototype.update = function() {
    this.age++;

    this.yPosition -= this.ySpeed;

    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;

}

Bubble.prototype.draw = function() {

    bubbleCtx.beginPath();
    bubbleCtx.arc(this.xPosition,this.yPosition,this.radius,0,2*Math.PI);
    bubbleCtx.stroke();

    for (var i = 0; i < allBubbles.length; i++){

    }
    // fill(dropColor);
    // ellipse(this.position.x,this.position.y,dropDia,dropDia);
}


function whenThePageLoads(){
    // console.log('on load');
    setInterval(drawBubbleCanvas, bubbleUpdateInterval);

}


// page load
// draw bubble canvas
//    time++
//    add bubbles
//    clear canvas
//    draw and update each bubble

// drawCanvas , called constantly
function drawBubbleCanvas() {
    
    time += 1;

    // add bubbles every t% add interval
    if (time % bubbleRate === 0) {

        var newX = Math.floor(Math.random()*bubbleCanvasEl.width);
        var newY = bubbleCanvasEl.height;
        
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
}

whenThePageLoads();
