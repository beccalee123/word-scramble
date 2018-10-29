//TEST WORD
var testWord = 'Word'

//will need to create handling for uppercase/lowercase letters when accepting submission

//Create variable for submit?
var scrambleSubmission = document.getElementById('scramble-submit');
var input = document.getElementById('input');

//FORM SUBMISSION
var handleScrambleSubmission = function(event){
  console.log(`the user submitted an answer`);
  //prevent page reload on submission. Will need to add this back in, but is currently breaking the keyup function.
  // event.preventDefault();
  //prevent empty fields
  if (input.value == ''){
  return alert('Field cannot be empty');
  //check for correct word
  } else if (input.value === testWord){ //this will need to be updated for final version
  return alert('Good job!!!')
  }
}

//ADD EVENT LISTENER

scrambleSubmission.addEventListener('click', handleScrambleSubmission);
input.addEventListener('keyup', function(e) {
  if (e.which === 13){
    handleScrambleSubmission();
    event.preventDefault();
  }
});
