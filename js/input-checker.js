//TEST WORD
var testWord = 'WORD'
var altWord = 'ALTWORD'

//CREATE VARIABLES
var scrambleSubmission = document.getElementById('scramble-submit');
var input = document.getElementById('input');

//FUNCTION FOR FORM CLEARING
function clearInput() {
  input.value = '';
};

//FORM SUBMISSION
var handleScrambleSubmission = function (event) {
  console.log(`the user submitted an answer`);
  //prevent page reload on submission. Will need to add this back in, but is currently breaking the keyup function.
  //event.preventDefault();
  //prevent empty fields
  if (input.value == '') {
    document.getElementById('alerts').innerHTML = 'Field cannot be empty';
    //check for correct word
  } else if (input.value === testWord) { //this will need to be updated for final version to reflect word scramble code setup
    document.getElementById('alerts').innerHTML = `${input.value} was the correct word - good job!`;
    clearInput();
    //Add functionality to cue up the next word
    //Add functionality to add 15 seconds to timer up to max of 5 min
    //Add functionality to add to score tally based on number of letters in word
  } else if (input.value === altWord) {
    document.getElementById('alerts').innerHTML = `${input.value} is a real word, but we're looking for something with an Ocean theme.`;
    clearInput();
  } else if (input.value !== testWord) {
    document.getElementById('alerts').innerHTML = `Nice try, but ${input.value} is not correct. Try again!`;
    clearInput();
  }
}

//ADD EVENT LISTENER

scrambleSubmission.addEventListener('click', handleScrambleSubmission);
input.addEventListener('keyup', function (e) {
  if (e.which === 13) {
    handleScrambleSubmission();
    event.preventDefault();
  }
});

//ADD FEATURE SO ALL TEXT ENTERED INTO INPUT IS DISPLAYED AS UPPERCASE

// forceKeyPressUppercase function sourced from  https://www.the-art-of-web.com/html/input-field-uppercase/

function forceKeyPressUppercase(e)
  {
    var charInput = e.keyCode;
    if((charInput >= 97) && (charInput <= 122)) { // lowercase
      if(!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKEY) { // no modifier key
        var newChar = charInput - 32;
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        e.target.setSelectionRange(start+1, start+1);
        e.preventDefault();
      }
    }
  }

  document.getElementById('input').addEventListener('keypress', forceKeyPressUppercase, false);
  document.getElementById('input').addEventListener('keypress', forceKeyPressUppercase, false);
