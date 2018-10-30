'use strict';

var shuffledList = [];


//shuffles an array into another array
//array.shuffle(arry) 
Array.prototype.shuffle = function(array1) {

  this.splice(0, this.length); // clear all items in this array

  var array2 = array1.slice(0); // make a copy of array1 in array2
  
  while(array2.length > 0) {
    var i = Math.floor(Math.random() * array2.length); //i = random index of arry
    this.push(array2[i]); //add array2[i] to this
    array2.splice(i, 1);  //cut i from array2
  }
}

shuffledList.shuffle(wordList);

//returns a scrambled word, takes in roundNumber as an argument;
function scrambledWord(roundNumber) {
  var word = shuffledList[roundNumber];
  var letterArray = Array.from(word);
  var shuffledWord = [];

  //console.log(word);
  //scramble until shuffledWord is different from letterArray
  
  do {
    shuffledWord.shuffle(letterArray);
  } while (shuffledWord === letterArray) {
    shuffledWord.shuffle(letterArray);
  }
  
  return shuffledWord;
}
