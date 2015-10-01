// Engine.js
// This file provides functionality to render and update the grid. It also 
// The canvas context (ctx) is made available globally, as are other utilities.

var Engine = (function(global) {

/*
  var doc = global.document,
      win = global.window,
      canvas = doc.createElement('canvas'),
      ctx = canvas.getContext('2d'),

  canvas.width = 800
  canvas.height = 600
  doc.body.appendChild(canvas);

  // Called by main, and itself calls all functions which may need to update entity's data
  function update() {
    updateEntities() 
  }

  // This loops through all blocks and calls their update method
  function updateEntities() {
    allBlocks.forEach(function(block) {
      block.update(some var here maybe ?SPEED? );
    });
  }

*/



  // Function that returns the initial array of cell objects, each with their
  // respective coordinate point. 
    // Parameters include: 
      // - Width and height of grid specified in number of cells
      // - Array of the initial cells that should be set to true (alive)
      // - the Cell constructor function
  function makeCells(width, height, startingCellArr, cellConstructor) {
    var cellArr = [];
    for(var i = 0; i < height; i++) {
      for(var j = 0; j < width; j++) {
        cellArr.push(new cellConstructor(j, i).setLifeStatus(startingCellArr))
      }    
    }
    return cellArr;
  }

  // Constructor function that creates each cell object.
  function Cell(j, i) {
    this.x = j;
    this.y = i;
    return this;
  }

  // Cell.prototype method that sets a cells life to false unless it's coordinates are in an array.
  Cell.prototype.setLifeStatus = function(arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].x === this.x && arr[i].y === this.y) {
        this.life = 1;
        return this
      }
      else {
        this.life = 0;
       }
     }
    return this;
  }

  // Make grid object that will carry the current status of the grid and fill it.
  var grid = {}
  grid.currentGrid = makeCells(8, 10, [{x : 0, y : 0}, {x: 2, y:3}], Cell);

  // Takes callback function currentRule that decides how each cell will be altered and returns a new array.
  function updateCells(arr, currentRule) {
    var nextGrid = [];
    arr.forEach(function(x) {
      nextCell.push(x.setRules(currentRule))
    });
    return nextGrid;
  }

  // Classic (default) rules that need to be passed to setRules
  function classicRules(n) {
    if(n < 2) return 1;
    if(n === 2 || n === 3) return this.alive;
    if(n > 3) return 0;
    if(n === 3) return 1;
  }
    
  // Function that passes Cell.prototype.setRules whatever rules we want for when we call updateCells.
  // This allows us to dynamically change the rules of the game. 
  // Cell.prototype.setRules sets x, y, and finds the number of alive neighbors. 
  // It then sets the life of the cell depending on rules.
  function setCellProtoRule(rules) {
    Cell.prototype.setRules = function(rules) {
    var x = this.x;
    var y = this.y;

    var neighbors = grid.currentGrid[]

    this.life = rules(neighbors)
    }
  }

  setCellProtoRule(classicRules);
  // */
}(this)) 