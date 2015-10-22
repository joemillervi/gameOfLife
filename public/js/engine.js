/**
* Engine.js
* This file provides functionality to render and update the grid.
*/

var Engine = (function(global) {

  /****** Initialize, Update and Print Grid ******/
  // --- Initial grid setup

  var grid = {};

  /**
  * return initial array of cells (coordinates)
  * width, height are the number of cells in each row
  * startingCellArr is an array of coordinates that will be initially set to alive
  */
  function makeCells(width, height, startingCellArr) {
    grid.width = width;
    grid.height = height;
    var cellArr = [];
    traverseGrid(grid.width, grid.height, function(x, y) {
      cellArr.push(new Cell(x, y).setLifeStatus(startingCellArr));
    });
    return cellArr;
  }

  // create each cell object
  var Cell = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // Cell.prototype method that sets a cell's life to false unless its coordinates are in startingCellArr
  Cell.prototype.setLifeStatus = function(arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].x === this.x && arr[i].y === this.y) {
        this.life = 1;
        return this
      }
      else this.life = 0;
     }
    return this;
  }

  // --- Updating the grid
 
  /**
  * Update life status of each cell according to currentRule
  * of Cell.prototype.rules and return a new array of cells. 
  * Prints to DOM after updating and updates cache
  */
  function updateCells() {
    var nextGrid = [];
    grid.currentGrid.forEach(function(x, i) {
      var updatedCell = updateCell(x)
      // push updated cell to grid arr
      nextGrid.push(updatedCell);
      // update div status of that cell if the user is not dragging a pattern 
      if(!uI.draggedOver) updateDiv.call(updatedCell, i); 
    });
    grid.currentGrid = nextGrid;
    grid.cache.push(grid.currentGrid)
    // if the user is dragging a pattern we have to add the pattern to the grid
    if(uI.draggedOver) {
      var tempGrid = clone(grid.currentGrid);
      uI.arrOfTmpCells.forEach(function(c){
        // find the index of this cell in tempGrid and turn the cell on
        var index = c.x + grid.width * c.y;
        if(tempGrid[index] !== undefined) tempGrid[index].life = 1; 
      })
      // write the grid to the dom that contains the pattern being dragged by user
      updateDivs(tempGrid);
    }
  }

  // take a cell object and return a new, updated object that still inherits from Cell.prototype
  function updateCell(c) {
    var newObj = new Cell;
    newObj.x = c.x;
    newObj.y = c.y;
    newObj.life = c.life;
    var numAliveNeighbours = findAliveNeighbours(newObj.x, newObj.y);
    // set life status according to Cell.prototype.rules current rules
    newObj.rules(numAliveNeighbours);
    return newObj;
  }

  // classic (default) rules
  Cell.prototype.rules = function(n) {
    if(n < 2) this.life = 0;
    if(n === 2) this.life = this.life;
    if(n > 3) this.life = 0;
    if(n === 3) this.life = 1;
  }

  // return the amount of alive neighbors for a given cell location in grid.currentGrid
  function findAliveNeighbours(x, y) {
    var counter = 0;
     for(var i = x-1; i < x + 2; i++) {
      for(var j = y - 1; j < y + 2; j++) {
        // checks to see if cell is the current cell
        if(i === x && j === y) continue;
        // checks to see if cell is off grid
        if(i > grid.width - 1 || j > grid.height - 1 || i < 0 || j < 0) continue;
        // finds the cell in the current grid array and checks to see if it is alive
        if(grid.currentGrid[i + grid.width * j].life) {
          counter++;
        }
      }
    }
    return counter;
  }

  // --- Create divs in DOM

  var gridSpace = document.getElementById('grid-space');
  var titleSpace = document.getElementById('title-space');

  // read the window size and append divs to fill it
  function printInitialGrid(size, startingCellArr) {
    gridSpace.innerHTML = '';
    grid.currentGrid = setMakeCells(size)(startingCellArr);
    appendFirstDivs(grid.currentGrid, size);
    grid.cache = [grid.currentGrid];
    updateDivs(grid.currentGrid);
  }

  // read the window size and return makeCells bound with the number of divs vertically and horizontally
  function setMakeCells(size) {
    var wH = makeWH(size)
    return makeCells.bind(this, wH[0], wH[1])
  }

  // create div for each cell and append it to gridSpace with the needed event listeners
  function appendFirstDivs(arr, size) {
    var size = parseInt(size)
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 35; // make room for title
    var w = Math.floor(windowWidth / size);
    var h = Math.floor(windowHeight / size);
    // calculate the extra space
    var widthDiff = windowWidth % size;
    // add the needed amount width to each cell to fill the window
    var widthSize = (size + widthDiff / w);
    // convert to percentage
    var widthPercent = widthSize / windowWidth * 100;
    // begin to alter the DOM
    gridSpace.style.width = windowWidth + 'px';
    // add excess height to title
    titleSpace.style.height = (windowHeight - (size * h)) + 35 + 'px';
    for(var i = 0; i < arr.length; i++) {
      var cellDiv = document.createElement('div');
      cellDiv.className = 'cellDiv';
      cellDiv.style.height = size + 'px';
      cellDiv.style.width = widthPercent + '%';
      cellDiv.id = i;
      // add the event listeners
      (function(i) {
        // click and drag to turn cells on
        cellDiv.addEventListener('mouseover', function() {
          if(uI.mouseDown) {
            var currentDivCell = document.getElementById(i)
            currentDivCell.style.background = uI.cellAliveColor
            grid.currentGrid[i].life = 1;
            grid.cache[grid.cache.length - 1] = grid.currentGrid;
          }
          uI.makeDraggedCell(i) // pattern drag and drop functionality, draws a pattern around the cell
        })
        cellDiv.addEventListener('mousedown', function() {
          // drop pattern here if that is what the user is doing
          if(uI.targetBoxStatus) { 
            uI.dropPattern();
            uI.targetBoxStatus = false;
            return;
          }
          // otherwise activate or kill the cell
          var currentDivCell = document.getElementById(i)
          if(grid.currentGrid[i].life) {
            currentDivCell.style.background = uI.cellDeadColor;
            grid.currentGrid[i].life = 0;
          }
          else {
            currentDivCell.style.background = uI.cellAliveColor;
            grid.currentGrid[i].life = 1;
          }  
           grid.cache[grid.cache.length - 1] = grid.currentGrid;
        })
        gridSpace.appendChild(cellDiv)
      }(i))
    }
  }

  // --- Update divs in DOM

  // update a specific Div (this), used in updateCells
  function updateDiv(i) {
    var currentCell = document.getElementById(i);
    if(this.life) {
      currentCell.style.background = uI.cellAliveColor;
    }
    else {
      currentCell.style.background = uI.cellDeadColor;
    }
  }
  
  // update all divs given a array of cell objects (Used in stepBack)
  // does NOT update the grid or cells
  function updateDivs(arr) {
    arr.forEach(function(x, i) {
      updateDiv.call(x, i)
    })
  }

  // --- Utilities

  // return random initial array for a given screensize, param size is the cellsize in px
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

  // return [h, w] for the current window area (number of divs/cells that can fit horizontally and vertically)
  function makeWH(size) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 35;
    // calculate the number of cells we can fit in the width and height (there will be extra space)
    var w = Math.floor(windowWidth / size);
    var h = Math.floor(windowHeight / size);
    return [w, h];
  }

  // take a callback and pass x and y to it for a given grid
  function traverseGrid(height, width, fn) {
    for(var y = 0; y < width; y++) {
      for(var x = 0; x < height; x++) {
        fn(x, y)
      }
    }  
  }

  /****** UI ******/
  // --- Buttons

  uI = {};

  // checks to see if play button was clicked
  uI.play = false;
  var playPause = document.getElementById('play-pause');
  playPause.addEventListener('click', function(){
    if(uI.play === false) {
      uI.play = true;
      playPause.src = "images/pause-icon.png"
    }
    else {
      uI.play = false;
      playPause.src = "images/play-icon.png" 
    }
  })

  // calls updateCells once
  var fwdBtn = document.getElementById('fwd');
  fwdBtn.addEventListener('click', function(){
    updateCells();
  })

  // sets grid.currentGrid back one grid step, and updates DOM
  var stepBackBtn = document.getElementById('step-back');
  stepBackBtn.addEventListener('click', function() {
    // use grid.cache to update the divs backwards one step, and update state of grid.currentGrid
    if(grid.cache.length === 1) grid.currentGrid = grid.cache[0];
    else {
      grid.cache.pop()
      grid.currentGrid = grid.cache[grid.cache.length - 1]
    }
    updateDivs(grid.currentGrid)
  })

  // menu bar
  var menuBar = document.getElementById('menu-bar');
  var menuIcon = document.getElementById('menu-icon');

  // ability to toggle menu bar
  menuIcon.addEventListener('click', function() {
    toggleMenuBar()
  })
  
  // toggle menu bar
  var toggleMenuBar = (function() {
    var menuBarStatus = false;
    return function() {
      if(menuBarStatus) {
        menuBarStatus = false;
        menuBar.classList.remove('slide-right')
        menuBar.classList.add('slide-left')
      }
      else {
        menuBarStatus = true;
        menuBar.classList.remove('slide-left')
        menuBar.classList.add('slide-right')
      }
    }
  })()
  
  // Check if mouse is held down
  uI.mouseDown = 0;  
  document.body.onmousedown = function() {
    uI.mouseDown = 1;
  }
  document.body.onmouseup = function() {
    uI.mouseDown = 0;
  }

  // --- Menu functionality

  // Change alive and dead colors
  uI.cellDeadColor = 'black';
  uI.cellAliveColor = 'red';

  uI.updateColor = function(paramToChange) {
    // check which color was updated by user
    if(paramToChange === 'cellAliveColor') var color = document.getElementById('alive-color-input').value;
    else var color = document.getElementById('dead-color-input').value;
    uI[paramToChange] = color;
    updateDivs(grid.currentGrid)
  }

  // change fade
  uI.updateFadeout = function() {
    console.log('called')
    var allCells = document.getElementsByClassName('cellDiv');
    allCells = Array.prototype.slice.call(allCells);
    uI.fade = document.getElementById('fade').value;
    allCells.forEach(function(x) {
      x.style.transition = uI.fade/1000 + 's';
    })
  }

  // change cell size and reprint grid
  uI.size = 15; // default
  uI.changeSize = function() {
    // check for numbers out of range 10-100
    var inputSize = document.getElementById('size');
    if(inputSize.value < 10) {
      uI.size = 10;
      inputSize.value = '10';
    }
    if(inputSize.value > 100) {
    uI.size = 100;
    inputSize.value = '100';
    }
    else uI.size = inputSize.value
    // pause
    uI.play = false; 
    playPause.src = "images/play-icon.png"
    var randoArr = randomArr(uI.size);
    printInitialGrid(uI.size, randoArr);
    reUpdateFadeout()
  }

  // change interval
  uI.interval = 50; // default interval
  uI.changeInterval = function() {
    var inputSpeed = document.getElementById('interval').value;
    uI.interval = parseInt(inputSpeed);
  }

   
  // reprint grid with all cells set to dead
  uI.clear = function() {
    grid.currentGrid.forEach(function(c) {
      if(c.life) c.life = false;
    })
    grid.cache.push(grid.currentGrid)
    updateDivs(grid.currentGrid)
    // pause game
    uI.play = false;
    playPause.src = "images/play-icon.png"
    reUpdateFadeout()
  }

  // reprint grid with random cells
  uI.randomize = function() {
    var randoArr = randomArr(uI.size);
    printInitialGrid(uI.size, randoArr)
    // pause game
    uI.play = false;
    playPause.src = "images/play-icon.png"
    reUpdateFadeout()
  }

  // ability to change rules
  uI.changeRules = function(x) {
    var rules = x || document.getElementById('users-rules').value;
    Cell.prototype.rules = new Function('n', rules);
  }
  
  // after reprinting the whole grid fade amount must be re-applied
  function reUpdateFadeout(){
    var allCells = document.getElementsByClassName('cellDiv');
    allCells = Array.prototype.slice.call(allCells);
    allCells.forEach(function(x) {
      x.style.transition = uI.fade/1000 + 's';
    })
  }

  // --- Components for the drag and drop system

  // make arr of pattern objects
  var arrOfPatterns = []
  arrOfPatterns.PatternObj = function(n, t, l, i, s, p) {
    this.push({name: n, type: t, period: l, info: i, src: s, rotate: rotate(),  pattern: p})
    return this
  }

  arrOfPatterns
    .PatternObj('Glider','Spaceship','4', 'Gliders travel diagonally at a speed of c/4.', 'images/glider.png', [{"x":-1,"y":-1},{"x":0,"y":0},{"x":1,"y":0},{"x":-1,"y":1},{"x":0,"y":1}])// Glider
    .PatternObj('LWSS', 'Spaceship', '4', 'Random soups will emit one LWSS for approximately every 615 gliders. It moves orthogonally at c/2.', 'images/lwss.png', [{"x":-2,"y":-2},{"x":1,"y":-2},{"x":2,"y":-1},{"x":-2,"y":0},{"x":2,"y":0},{"x":-1,"y":1},{"x":0,"y":1},{"x":1,"y":1},{"x":2,"y":1}])// LWSS
    .PatternObj('Clock', 'Oscillator', '2', 'The Clock is the 6th most common oscillator', 'images/clock.png', [{"x":0,"y":-3},{"x":-2,"y":-2},{"x":0,"y":-2},{"x":-1,"y":-1},{"x":1,"y":-1},{"x":-1,"y":0}])// Clock
    .PatternObj('Jam', 'Oscillator', '3', 'The Jam is was found in 1988 and is the 17th most common oscillator', 'images/jam.png', [{"x":1,"y":-3},{"x":2,"y":-3},{"x":0,"y":-2},{"x":3,"y":-2},{"x":-2,"y":-1},{"x":1,"y":-1},{"x":3,"y":-1},{"x":-2,"y":0},{"x":2,"y":0},{"x":-2,"y":1},{"x":1,"y":2},{"x":-1,"y":3},{"x":0,"y":3}])// Jam
    .PatternObj('Pentadecathlon', 'Oscillator', '15', 'The Pentadecathlon is a period 15 pulsing oscillator as it undulates throughout its cycle.', 'images/pentadecathlon.png', [{"x":-2,"y":-1},{"x":3,"y":-1},{"x":-4,"y":0},{"x":-3,"y":0},{"x":-1,"y":0},{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0},{"x":4,"y":0},{"x":5,"y":0},{"x":-2,"y":1},{"x":3,"y":1}])// Pentadecathlon
    .PatternObj('R-pentomino', 'Methuselah', 'na', 'The glider it releases in generation 69, noticed by Richard K. Guy, was the first glider ever observed.', 'images/theR.png', [{"x":0,"y":-1},{"x":1,"y":-1},{"x":-1,"y":0},{"x":0,"y":0},{"x":0,"y":1}])// R-pentomino
    .PatternObj('Acorn', 'Methuselah', 'na', 'The stable pattern that results from the acorn has 633 cells and consists of 41 blinkers.', 'images/acorn.png', [{"x":-2,"y":-1},{"x":0,"y":0},{"x":-3,"y":1},{"x":-2,"y":1},{"x":1,"y":1},{"x":2,"y":1},{"x":3,"y":1}])// Acorn
    .PatternObj('Glider Gun', 'Gun', '30', 'The Glider Gun consists of two queen bee shuttles stabilized by two blocks.', 'images/gliderGun.png', [{"x":9,"y":-6},{"x":7,"y":-5},{"x":9,"y":-5},{"x":-3,"y":-4},{"x":-2,"y":-4},{"x":5,"y":-4},{"x":6,"y":-4},{"x":19,"y":-4},{"x":20,"y":-4},{"x":-4,"y":-3},{"x":0,"y":-3},{"x":5,"y":-3},{"x":6,"y":-3},{"x":19,"y":-3},{"x":20,"y":-3},{"x":-15,"y":-2},{"x":-14,"y":-2},{"x":-5,"y":-2},{"x":1,"y":-2},{"x":5,"y":-2},{"x":6,"y":-2},{"x":-15,"y":-1},{"x":-14,"y":-1},{"x":-5,"y":-1},{"x":-1,"y":-1},{"x":1,"y":-1},{"x":2,"y":-1},{"x":7,"y":-1},{"x":9,"y":-1},{"x":-5,"y":0},{"x":1,"y":0},{"x":9,"y":0},{"x":-4,"y":1},{"x":0,"y":1},{"x":-3,"y":2},{"x":-2,"y":2}])// Glider Gun

  // function that returns a function that rotates the pattern and returns the amount to rotate the div
  function rotate() {
    var currentDegree = 0;
    return function() {
      this.pattern.forEach(function(c) {
       var x = c.x
       var y = c.y
       // rotate
       c.x = -y
       c.y = x
      })
      // rotate the div in circles
      currentDegree = currentDegree === 270 ? 0 : currentDegree += 90;
      // add property of how much each pattern has been rotated (for the div background img)
      this.degrees = currentDegree; 
      return currentDegree;
    }
  }

  // rotate currently selected pattern div and coordinates in arrOfPatterns
  uI.rotateCurrentPattern = function() {
    var i = uI.patternCount;
    // rotate the coordinates of the pattern, and return what the div rotate should be set to
    targetBox.style.transform = "rotate(" + arrOfPatterns[i].rotate() + "deg)";
  }

  // pattern count 0 - 7 for pattern items
  uI.patternCount = 0;

  // get id of all the data fields
  var name = document.getElementById('name');
  var type = document.getElementById('type');
  var period = document.getElementById('period');
  var info = document.getElementById('info');

  function updateInfo(i) {
    currentObj = arrOfPatterns[i];
    // set background img
    targetBox.style.backgroundImage = "url('" + currentObj.src + "')";
    // deal with rotation
    if(currentObj.degrees) targetBox.style.transform = "rotate(" + currentObj.degrees + "deg)";
    else targetBox.style.transform = "rotate(" + 0 + "deg)";
    // fill in info fields
    name.innerHTML = currentObj.name
    type.innerHTML = currentObj.type
    period.innerHTML = currentObj.period
    info.innerHTML = currentObj.info
  }

  // change info and picture as user selects a pattern
  uI.incPattern = function() {
    if(uI.patternCount < 7) {
      uI.patternCount++;
      updateInfo(uI.patternCount)
    }  
  }
    uI.decPattern = function() {
    if(uI.patternCount > 0) {
      uI.patternCount--;
      updateInfo(uI.patternCount)
    }  
  }

  // toggle status of targetBox (where pattern is dragged from)
  uI.targetBoxStatus = false;
  var targetBox = document.getElementById('target-box');
  targetBox.addEventListener('click', function() {
    uI.targetBoxStatus = !uI.targetBoxStatus;
  })

  // on rollover of cell
  uI.makeDraggedCell = function(i) {
    var currentCell = grid.currentGrid[i];
    if(uI.targetBoxStatus) {
      uI.draggedOver = true;
      // make array of cells to temporarly activate selected pattern around mouse
      uI.arrOfTmpCells = arrOfPatterns[uI.patternCount].pattern.map(function(c) {
        return {x: c.x + currentCell.x, y: c.y + currentCell.y}
      });
      var tempGrid = clone(grid.currentGrid);
      // find cells in grid array and turn them on
      uI.arrOfTmpCells.forEach(function(c){
        var index = c.x + grid.width * c.y;
        if(tempGrid[index] !== undefined) tempGrid[index].life = 1;
      })
      updateDivs(tempGrid)
    }
    uI.currentTempGrid = tempGrid; // make available in case of a click, placing the pattern
  }

  // if user is dragging a pattern and drags it back over menuBar, remove pattern from grid
  menuBar.addEventListener('mouseover', function() {
    uI.draggedOver = false;
    if(!uI.play) {
      updateDivs(grid.currentGrid)
    }
  })

  // on dropping the pattern
  uI.dropPattern = function() {
    grid.currentGrid = uI.currentTempGrid;
    grid.cache.push(grid.currentGrid);
    uI.draggedOver = false;
    uI.targetBoxStatus = false;
  }

  /****** Library ******/

  // clone an array of cell objects
  function clone(arr) {
    var returnArr = [];
    arr.forEach(function(x) {
      var clonedCell = new Cell(x.x, x.y);
      clonedCell.life = x.life;
      returnArr.push(clonedCell);
    }) 
    return returnArr;
  }

  /** 
  * // take grid and log JSON file of alive cells (used for making patterns)
  *
  * function logGrid() {
  *   var returnArr = [];
  *   var tempGrid = clone(grid.currentGrid)
  *   tempGrid.forEach(function(c) {
  *     if(c.life) {
  *       newObj = {x: c.x - 1, y: c.y - 1}
  *       returnArr.push(newObj)
  *     }
  *   })
  *   console.log(JSON.stringify(returnArr))
  * }
  */
  
  /****** Public Objects ******/

  // Public functions for app.js
  return {
    printInitialGrid: printInitialGrid,
    randomArr: randomArr,
    updateCells: updateCells, 
    uI: uI
  }
  
})(this)