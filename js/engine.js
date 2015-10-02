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
    var cellArr = [];
    for(var i = 0; i < width; i++) {
      for(var j = 0; j < height; j++) {
        cellArr.push(new cellConstructor(i, j).setLifeStatus(startingCellArr))
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
  grid.currentGrid = makeCells(3, 2, [{x : 0, y : 0}, {x: 0, y:1}, {x : 1, y : 0}], Cell);
  console.log(grid.currentGrid)

  /****** Updating the grid ******/

  // Function that will update life status of each cell according to currentRule
  // and return a new array of cells
  function updateCells(arr, currentRule) {
    var nextGrid = [];
    arr.forEach(function(x) {
      console.log(x)
      nextGrid.push(x.setRules(currentRule))
    });
    return nextGrid;
  }

  // Function that assigns Cell.prototype.setRules to be a function that sets a cells life status
  // depending on the rules passed to makeSetRules
  function makeSetRules(rules) {
    Cell.prototype.setRules = function(rules) {
    var x = this.x;
    var y = this.y;
    var numAliveNeighbours = findAliveNeighbours(x, y);
    this.life = rules(numAliveNeighbours)
    }
  }

  // Classic (default) rules that need to be passed to setRules
  function classicRules(n) {
    if(n < 2) return 0;
    if(n === 2 || n === 3) return this.alive;
    if(n > 3) return 0;
    if(n === 3) return 1;
  }

// Function that will return the amount of alive neighbours for a given cell location
function findAliveNeighbours(x, y) {
  var counter = 0;
   for(var i = x-1; i < x + 2; i++) {
    for(var j = y - 1; j < y + 2; j++) {
      if(i === x && j === y) {
        continue;
      }
      // Checks to see if cell is off grid
      if(grid.currentGrid[i + grid.width * j] === undefined) {
        continue;
      }
      if(grid.currentGrid[i + grid.width * j].life) {
        counter++;
      }
    }
  }
  console.log('counter', counter)
  return counter;
}
  
  makeSetRules(classicRules);
  updateCells(grid.currentGrid, classicRules)







}(this)) 