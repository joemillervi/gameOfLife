// Engine.js
// This file provides functionality to render and update the grid, 
// change the rules of the game, and set initial cells.

function Engine() {
  // Accesses to global scope

  /****** Initial grid setup ******/

  // Create grid object
  var grid = {}

  // Make initial grid and set alive cells according to startingCellArr
  function makeCells(width, height, startingCellArr) {
    grid.width = width;
    grid.height = height;
    var cellArr = [];
    traverseGrid(grid.width, grid.height, function(x, y) {
      cellArr.push(new Cell(x, y).setLifeStatus(startingCellArr))
    })
    return cellArr;
  }

  // Create each cell object
  var Cell = function (x, y) {
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

/*
  Cell.prototype.setLifeStatus = function(arr) {
    var that = this
    arr.forEach(function(q) {
      if(q.x === that.x && q.y === that.y) {
        that.life = 1;
      }
      else {
        that.life = 0;
      }
    })
    return that;
  }
*/

  /****** Updating the grid ******/

  // Update life status of each cell according to currentRule
  // of Cell.prototype.rules and return a new array of cells
  function updateCells() {
    var nextGrid = [];
    grid.currentGrid.forEach(function(x, i) {
      nextGrid.push(updateCell(x));
      updateDiv.call(x, i); // Update class of the corresponding div
    });
    grid.currentGrid = nextGrid;
  }

  // Take a cell object,
  // Return a new, updated object that still inherits from Cell.prototype
  function updateCell(c) {
    var newObj = new Cell;
    var x = newObj.x = c.x;
    var y = newObj.y = c.y;
    newObj.life = c.life;
    var numAliveNeighbours = findAliveNeighbours(x, y);
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



  // Return the amount of alive neighbours for a given cell location in grid.currentGrid
  function findAliveNeighbours(x, y) {
    var counter = 0;
     for(var i = x-1; i < x + 2; i++) {
      for(var j = y - 1; j < y + 2; j++) {
       //console.log(i,j)
        if(i === x && j === y) {
          //console.log('found self', i, j)
          continue;
        }
        // Checks to see if cell is off grid
        if(i > grid.width - 1 || j > grid.height - 1 || i < 0 || j < 0) {
          //console.log('off grid', i, j)
          continue;
        }
        if(grid.currentGrid[i + grid.width * j].life) {
          //console.log('found life', grid.currentGrid[i + grid.width * j], i, j)
          counter++;
        }
      }
    }
    return counter;
  }
 
  /****** Create divs in DOM ******/
  var cellDeadColor = 'black'
  var cellAliveColor = 'red'
  var gridSpace = document.getElementById('grid-space')
  var titleSpace = document.getElementById('title-space');

  // Read the window size and append divs to fill it
  function printInitialGrid(size, startingCellArr) {
    grid.currentGrid = setMakeCells(size)(startingCellArr)
    appendFirstDivs(grid.currentGrid, size)
  }

  // Read the window size and return makeCells bound with h and w supplied.
  function setMakeCells(size) {
    var wH = makeWH(size)
    return makeCells.bind(this, wH[0], wH[1])
  }

  // Create Div for each cell and append it to gridSpace
  function appendFirstDivs(arr, size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 35;
    var w = Math.floor(windowWidth / size);
    var h = Math.floor(windowHeight / size);
    // Calculate the extra space
    var widthDiff = windowWidth % size;
    var heightDiff = windowHeight % size;
    // Add the needed amount width to each cell to fill the window
    var widthSize = size + widthDiff / w;

    // Convert to percentage
    var widthPercent = widthSize / windowWidth * 100;

    // Begin to alter the DOM
    var gridSpace = document.getElementById('grid-space');
    // gridSpace.style.height = windowHeight + 'px';
    gridSpace.style.width = windowWidth + 'px';
    // 
    titleSpace = document.getElementById('title-space');
    titleSpace.style.height = (windowHeight - (size * h)) + 35 + 'px'
    for(var i = 0; i < arr.length; i++) {
      var cellDiv = document.createElement('div');
      cellDiv.className = 'cellDiv';
      cellDiv.style.height = size + 'px'; 
      cellDiv.style.width = widthPercent + '%'; 
      cellDiv.id = i;
      if(arr[i].life) cellDiv.style.background = cellDeadColor;
      else cellDiv.style.background = cellAliveColor;
      gridSpace.appendChild(cellDiv)
    }
  }



      // deal with the height difference
      // titleSpace.style.height = windowHeight - (size * h) + 'px';


  /****** Update divs in DOM ******/

  // Update a specific Div (this)
  // This function is called in updateCells, right after cell data is updated
  function updateDiv(i) {
    var currentCell = document.getElementById(i);
    if(this.life) {
      currentCell.style.background = cellAliveColor;
    }
    else {
      currentCell.style.background = cellDeadColor;
    }
  }
  
  /****** Utilities ******/

  // Return random initial array for a given window size
  function randomArr(size) {
    returnArr = [];
    var wH = makeWH(size)
    //console.log(wH)
    traverseGrid(wH[0], wH[1], function(x, y){
      if(Math.random() < .5) {
        returnArr.push({'x': x, 'y': y})
      }
    })
    return returnArr;
  }

  // Return [h, w] for the current window area
  function makeWH(size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 35;
    // Calculate the number of cells we can fit in the width and height (there will be extra space)
    var w = Math.floor(windowWidth / size);
    var h = Math.floor(windowHeight / size);
    return [w, h];
  }

  /****** UI ******/


  /****** Library ******/

  // Take a callback and pass x and y to it for a given grid
  function traverseGrid(height, width, fn) {
    for(var y = 0; y < width; y++) {
      for(var x = 0; x < height; x++) {
        fn(x, y)
      }
    }  
  }

  // Clear a div (used to clear grid)
  function clearElement(e) {
    if(e !== null) {
      e.innerHTML = ''
    }
  }

  // Allow for the modification of functions.
  function wrap(fn, callback) {
    return function() {  
      args = Array.prototype.slice.call(arguments);
      args.unshift(fn);
      return callback(args);
    }
  }


/****** Turn it on ******/
  function keepItUp() {
    setTimeout(updateCells(), 2000)
  }
  randoArr = randomArr(10)
  printInitialGrid(10, randoArr)
  window.setInterval(function() {
    keepItUp()
  }, 50  )


}

