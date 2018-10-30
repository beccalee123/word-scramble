//array endGameScore[name,score]

var endGameScore = [0];
//game loop {
  var word = shuffledList[i]; //sets word to the next item on shuffledList
  var scrambledWord = scrambledWord(i); //sets scrambledWord to the same word but scrambled
  endGameScore[0] += word.length;
  i++;
//}
//var name = user input;
endGameScore.unshift(name);
