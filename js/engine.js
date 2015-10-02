// Engine.js
// This file provides functionality to render and update the grid, 
// change the rules of the game, and set initial cells.

var Engine = (function(global) {
  // Accesses to global scope
  var doc = global.document,
      win = global.window;

  /****** Initial grid setup ******/

  // Create grid object
  var grid = {}

  // Function to make initial grid and set alive cells according to startingCellArr
  function makeCells(width, height, startingCellArr, cellConstructor) {
    grid.width = width;
    grid.height = height;
    var cellArr = [];
    for(var y = 0; y < width; y++) {
      for(var x = 0; x < height; x++) {
        cellArr.push(new cellConstructor(x, y).setLifeStatus(startingCellArr))
      }    
    }
    return cellArr;
  }

  // Constructor function that creates each cell object
  var Cell = function (x, y, life) {
    this.x = x;
    this.y = y;
    return this;
  }

  // Cell.prototype method that sets a cells life to false unless it's coordinates are in startingCellArr
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

  // Add property currentGrid to object grid and fill it
  grid.currentGrid = makeCells(2, 2, [{x : 0, y : 0}, {x: 0, y:1}, {x : 1, y : 0}], Cell);
  console.log(grid.currentGrid)

  /****** Updating the grid ******/

  // Function that will update life status of each cell according to currentRule
  // of Cell.prototype.rules and return a new array of cells
  function updateCells(arr) {
    var nextGrid = [];
    arr.forEach(function(x) {
      console.log(x);
      nextGrid.push(updateCell(x));
    });
    return nextGrid;
  }

  // Function that returns a new, updated object literal that still inherits from Cell.prototype
  function updateCell(obj) {
    var newObj = Object.create(Cell.prototype);
    var x = newObj.x = obj.x;
    var y = newObj.y = obj.y;
    newObj.life = obj.life;
    var numAliveNeighbours = findAliveNeighbours(x, y);
    console.log('alive neighbours:', numAliveNeighbours)
    // Set life status according to Cell.prototype.rules current rules
    newObj.rules(numAliveNeighbours);
    return newObj;
  }

  // Classic (default) rules
  Cell.prototype.rules = function(n) {
    if(n < 2) this.life = 0;
    if(n === 2) this.life = this.life;
    if(n > 3) this.life = 0;
    if(n === 3) this.life = 1;
  }

// Function that will return the amount of alive neighbours for a given cell location 
// in grid.currentGrid
function findAliveNeighbours(x, y) {
  var counter = 0;
   for(var i = x-1; i < x + 2; i++) {
    for(var j = y - 1; j < y + 2; j++) {
      if(i === x && j === y) {
        console.log('found self', i, j)
        continue;
      }
      // Checks to see if cell is off grid
      if(i > grid.width - 1 || j > grid.height - 1 || i < 0 || j < 0) {
        console.log('off grid', i, j)
        continue;
      }
      if(grid.currentGrid[i + grid.width * j].life) {
        console.log('found life', grid.currentGrid[i + grid.width * j], i, j)
        counter++;
      }
    }
  }
  return counter;
}
  
  var newGrid = updateCells(grid.currentGrid)
  console.log(newGrid)







}(this)) 