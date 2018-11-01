`use strict`

document.onkeydown = function (e) {
  if (e.which === 39) {
    skipWord();
  }
}