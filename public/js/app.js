/**
* App.js 
* This file prints the initial grid and starts the application loop
*/

// Turn it on
var randoArr = Engine.randomArr(Engine.uI.size);

Engine.printInitialGrid(Engine.uI.size, []);

// This is the loop
(function playing() {
  if(Engine.uI.play) Engine.updateCells();
  window.setTimeout(function() {
    return playing();
  }, Engine.uI.interval);
})()
