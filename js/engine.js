// Engine.js
// This file provides functionality to render and update the grid, 
// change the rules of the game, and set initial cells.


var Engine = function(global) {
  // Accesses to global scope
  var doc = global.document,
      win = global.window;
  /****** Initial grid setup ******/

  // Create grid object
  var grid = {}

  var sayHi = function(){ console.log('hi')}

  // Function to make initial grid and set alive cells according to startingCellArr
  function makeCells(width, height, startingCellArr) {
    grid.width = width;
    grid.height = height;
    var cellArr = [];
    traverseGrid(grid.width, grid.height, function(x, y) {
      cellArr.push(new Cell(x, y).setLifeStatus(startingCellArr))
    })
    return cellArr;
  }

  // Constructor function that creates each cell object
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

  // Add property currentGrid to object grid and fill it
  // grid.currentGrid = makeCells(2, 2, [{x : 0, y : 0}, {x: 0, y:1}, {x : 1, y : 0}], Cell);
  //console.log(grid.currentGrid)

  /****** Updating the grid ******/

  // Function that will update life status of each cell according to currentRule
  // of Cell.prototype.rules and return a new array of cells
  function updateCells() {
    var nextGrid = [];
    grid.currentGrid.forEach(function(x) {
      //console.log(x);
      nextGrid.push(updateCell(x));
    });
    grid.currentGrid = nextGrid;
  }

  // Function that returns a new, updated object literal that still inherits from Cell.prototype
  function updateCell(c) {
    var newObj = new Cell;
    var x = newObj.x = c.x;
    var y = newObj.y = c.y;
    newObj.life = c.life;
    var numAliveNeighbours = findAliveNeighbours(x, y);
    //console.log('alive neighbours:', numAliveNeighbours)
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
    // ALWAYS HAS TO BE SET TO CURRENT GRID.CURRENTGRID
    //grid.currentGrid = updateCells(grid.currentGrid)
    //console.log(grid.currentGrid)
    //grid.currentGrid = updateCells(grid.currentGrid)
    //console.log(grid.currentGrid)
 
  /****** Writing to the DOM ******/

  // Letting gridSpace by altered by everybody
  var gridSpace = document.getElementById('grid-space')

  // Function that reads the window size and appends divs to fill it.
  function printInitialGrid(size, startingCellArr) {
    grid.currentGrid = makeHWOnce(size)(startingCellArr)
    console.log(grid.currentGrid)
    appendFirstDivs(grid.currentGrid, size)
  }

  // Function that displays the cells in the grid.currentGrid to the DOM
  function appendFirstDivs(arr, size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    console.log(windowWidth)
    // Calculate the extra space
    var widthDiff = windowWidth % size;
    var heightDiff = windowHeight % size;
    // Add the needed amount of height and width to each cell to fill the window
    var widthSize = size + widthDiff / w;
    var heightSize = size + heightDiff / h;
    // Add each cell to the DOM
    for(var i = 0; i < arr.length; i++) {
      var cellDiv = document.createElement('div');
      cellDiv.className = 'cellDiv'
      cellDiv.style.height = heightSize + 'px'; 
      cellDiv.style.width = widthSize + 'px'; 
      gridSpace.appendChild(cellDiv);
      cellDiv.id = i;
      if(arr[i].life) cellDiv.style.background = 'black';
      else cellDiv.style.background = 'red';
    }
  }

  // Function that reads the window size and returns makeCells bound with h and w supplied.
  function makeHWOnce(size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    // Calculate the number of cells we can fit in the width and height (there will be extra space)
    w = Math.floor(windowWidth / size);
    h = Math.floor(windowHeight / size);
    return makeCells.bind(this, w, h)
  }

  // Function that updates the divs in gridSpace according to grid.currentGrid
  function updateDivs() {
    var arr = grid.currentGrid 
    for(var i = 0; i < arr.length; i++) {
      var thisCell = document.getElementById(i)
      if(arr[i].life) {
        thisCell.style.background = 'black';
      }
      else thisCell.style.background = 'red'
    }
  }

  randoArr = randomArr(10)
  printInitialGrid(10, randoArr)

  function keepItUp() {
    updateCells()
    setTimeout(updateDivs(), 2000)
  }

  window.setInterval(function() {
    keepItUp()
  }, 50  )


  /****** Utilties ******/

  // Function that returns random initial array for a given window size
  function randomArr(size) {
    returnArr = [];
    var wH = makeWH(size)
    console.log(wH)
    traverseGrid(wH[0], wH[1], function(x, y){
      if(Math.random() < .5) {
        returnArr.push({'x': x, 'y': y})
      }
    })
    return returnArr;
  }

  /****** Library ******/

  // Function that takes a callback and passes x and y to it for a given grid
  function traverseGrid(height, width, fn) {
    for(var y = 0; y < width; y++) {
      for(var x = 0; x < height; x++) {
        fn(x, y)
      }
    }  
  }

  // Function that clears a div (used to clear grid)
  function clearElement(e) {
    if(e !== null) {
      e.innerHTML = ''
    }
  }

  // Function that returns [h, w] for the current window area
  function makeWH(size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    // Calculate the number of cells we can fit in the width and height (there will be extra space)
    w = Math.floor(windowWidth / size);
    h = Math.floor(windowHeight / size);
    return [w, h];
  }


}