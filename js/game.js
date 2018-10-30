'use strict';
window.addEventListener('beforeunload', function (e){
    return 'dummy text';
});

// change nav item color
document.getElementsByTagName('li')[1].style.backgroundColor = 'lightblue';
