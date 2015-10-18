/**
* Engine.js
* This file provides functionality to render and update the grid,
*/

var Engine = (function(global) {

  /****** Initial grid setup ******/

  // Create grid object that will make avaliable: currentGrid, cache, width and height
  var grid = {};

  // Make initial grid and set alive cells according to startingCellArr
  // width, height are the number of cells in each row
  // startingCellArr is an array of cells that will be initially set to alive
  function makeCells(width, height, startingCellArr) {
    grid.width = width;
    grid.height = height;
    var cellArr = [];
    traverseGrid(grid.width, grid.height, function(x, y) {
      cellArr.push(new Cell(x, y).setLifeStatus(startingCellArr));
    });
    // Update or create cache (for reverse functionality)
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

  /****** Updating the grid ******/
 
  /**
  * Update life status of each cell according to currentRule
  * of Cell.prototype.rules and return a new array of cells. 
  * Prints to DOM after updating and Updates cache
  */
  function updateCells() {
    var nextGrid = [];
    grid.currentGrid.forEach(function(x, i) {
      nextGrid.push(updateCell(x));
      updateDiv.call(updateCell(x), i); 
    });
    grid.currentGrid = nextGrid;
    grid.cache.push(grid.currentGrid)

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
          continue;
        }
        // Checks to see if cell is off grid
        if(i > grid.width - 1 || j > grid.height - 1 || i < 0 || j < 0) {
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
  var gridSpace = document.getElementById('grid-space')
  var titleSpace = document.getElementById('title-space');

  // Read the window size and append divs to fill it
  function printInitialGrid(size, startingCellArr) {
    console.log('-----------')
    gridSpace.innerHTML = '';
    grid.currentGrid = setMakeCells(size)(startingCellArr)
    //console.log(grid.currentGrid)
    appendFirstDivs(grid.currentGrid, size)
    console.log('size',size)
    grid.cache = [grid.currentGrid];
    console.log('first cache', grid.cache)
    updateDivs(grid.currentGrid)
  }

  // Read the window size and return makeCells bound with h and w supplied.
  function setMakeCells(size) {
    var wH = makeWH(size)
    return makeCells.bind(this, wH[0], wH[1])
  }

  // Create Div for each cell and append it to gridSpace
  function appendFirstDivs(arr, size) {
    size = parseInt(size)
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 35;
    var w = Math.floor(windowWidth / size);
    var h = Math.floor(windowHeight / size);
    console.log('windowWidth ' + windowWidth, 'widnwoHeight '+windowHeight)
    // Calculate the extra space
    var widthDiff = windowWidth % size;
    console.log('widthDiff ', widthDiff)
    // Add the needed amount width to each cell to fill the window

    console.log('widthSize '+widthSize, typeof size, typeof widthDiff, typeof w)
    var widthSize = (size + widthDiff / w); // BUG HERE: the mat is wrong the second time
    console.log('widthSize '+widthSize, 'size ' +size, 'widthDiff ' + widthDiff, 'w '+w)
    // Convert to percentage
    var widthPercent = widthSize / windowWidth * 100;
    // Begin to alter the DOM
    gridSpace.style.width = windowWidth + 'px';
    // Add excess height to title
    titleSpace.style.height = (windowHeight - (size * h)) + 35 + 'px'
    console.log('width%' +widthPercent)
    for(var i = 0; i < arr.length; i++) {
      var cellDiv = document.createElement('div');
      cellDiv.className = 'cellDiv';
      cellDiv.style.height = size + 'px'; 
      cellDiv.style.width = widthPercent + '%'; 
      cellDiv.id = i;
      // Add the event listener to allow user to change life by click and drag
      (function(i) {
        cellDiv.addEventListener('mouseover', function() { 
          if(uI.mouseDown) {
            var mousedOverDiv = document.getElementById(i)
            console.log('clicked')
            mousedOverDiv.style.background = uI.cellAliveColor
            grid.currentGrid[i].life = 1;
            console.log(grid.currentGrid)
            grid.cache[grid.cache.length - 1] = grid.currentGrid;
            //console.log(JSON.stringify(grid.currentGrid))
          }     
        })
        cellDiv.addEventListener('mousedown', function() {
          var clickedDiv = document.getElementById(i)
          if(grid.currentGrid[i].life) {
            clickedDiv.style.background = uI.cellDeadColor;
            grid.currentGrid[i].life = 0;
          }
          else {
            clickedDiv.style.background = uI.cellAliveColor;
            grid.currentGrid[i].life = 1;
          }  
           grid.cache[grid.cache.length - 1] = grid.currentGrid;
           //console.log(JSON.stringify(grid.currentGrid))
        })
        gridSpace.appendChild(cellDiv)
      }(i))
    }
  }

  /****** Update divs in DOM ******/

  // Update a specific Div (this)
  // This function is called in updateCells, right after cell data is updated
  function updateDiv(i) {
    var currentCell = document.getElementById(i);
    if(this.life) {
      currentCell.style.background = uI.cellAliveColor;
    }
    else {
      currentCell.style.background = uI.cellDeadColor;
    }
  }
  
  // Update all divs given a array of cell objects (Used in stepBack)
  // does NOT update the grid or cells
  function updateDivs(arr) {
    arr.forEach(function(x, i) {
      updateDiv.call(x, i)
    })
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
    console.log('w' + w, 'h' + h)
    return [w, h];
  }

  // Use grid.cache to update the divs backwards one step. Also updates state of
  // grid.currentGrid
  function stepBack() {
    if(grid.cache.length === 1) {
      grid.currentGrid = grid.cache[0]
    }
    else {
      grid.cache.pop()
      grid.currentGrid = grid.cache[grid.cache.length - 1]
    }
    updateDivs(grid.currentGrid)
  }

  /****** UI ******/
  uI = {};
  // Checks to see if play button was clicked
  uI.play = false;
  var playBtn = document.getElementById('play');
  playBtn.addEventListener('click', function(){
    uI.play = true;
  })

  // Alters status of uI.play if paused is clicked
  var pauseBtn = document.getElementById('pause');
  pauseBtn.addEventListener('click', function() {
    uI.play = false;
  })

  // Calls updateCells once
  var fwdBtn = document.getElementById('fwd');
  fwdBtn.addEventListener('click', function(){
    updateCells();
    console.log('called updateCells')
  })

  // Sets grid.currentGrid back one grid step, and updates DOM
  var stepBackBtn = document.getElementById('step-back');
  stepBackBtn.addEventListener('click', function() {
      stepBack()
  })

  // Check if mouse is held down
  uI.mouseDown = 0;  
  document.body.onmousedown = function() {
    uI.mouseDown = 1;
  }
  document.body.onmouseup = function() {
    uI.mouseDown = 0;
  }

  // Menu bar
  var menuBar = document.getElementById('menu-bar');
  var menuIcon = document.getElementById('menu-icon');

  // Ability to toggle menu bar
  menuIcon.addEventListener('click', function() {
    toggleMenuBar()
  })

  var toggleMenuBar = (function() {
    var menuBarStatus = false;
    return function() {
      if(menuBarStatus) {
        menuBarStatus = false;
        menuBar.style.display = "none";
      }
      else {
        menuBarStatus = true;
        menuBar.style.display = "inline";
      }
    }
  })()

 // Ability to change colors
  uI.cellDeadColor = 'black';
  uI.cellAliveColor = 'red';

  uI.updateColor = function(x) {
    if(x === 'cellAliveColor') {
      var text = document.getElementById('alive-color-input').value;
    }
    else {
      var text = document.getElementById('dead-color-input').value;
    }
    console.log(text)
    uI[x] = text;
    updateDivs(grid.currentGrid)
  }

  // Ability to change fade
  uI.updateFadeout = function() {
    var allCells = document.getElementsByClassName('cellDiv');
    allCells = Array.prototype.slice.call(allCells);
    var fadeAmount = document.getElementById('fade').value;
    allCells.forEach(function(x) {
      x.style.transition = fadeAmount + 's';
    })
  }

  // Change cell size and reprint grid BUG HERE
  uI.changeSize = function() {
    var size = document.getElementById('size').value;
    console.log(size);

    printInitialGrid(size, []);
  }
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
  
  // Public functions for app.js
  return {
    printInitialGrid: printInitialGrid,
    randomArr: randomArr,
    updateCells: updateCells, 
    uI: uI
  }
  
})(this)