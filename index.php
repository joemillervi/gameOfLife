<!doctype html>
<head>
	<meta charset="utf-8" />
  <link rel="stylesheet" type="text/css" href="css/stylesheet.css" />
  <script src="js/engine.js"></script>
  <script src="js/app.js"></script>
</head>
<body>
  <div id="grid-space"></div>
 </body>

<head>
  <style type="text/css">
    .cellDiv {
      background-color: red;
      float:left;



    }
    body {
      background-color: blue;
      margin: 0;




    }
  </style>


  <script>

  gridSpace = document.getElementById('grid-space')
  console.log(gridSpace)
  Engine(this)
/*
  console.log('width: ' + window.innerWidth, 'height: ' + window.innerHeight)

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var size = 100;
  // Calculate the number of cells we can fit in the width and height (there will be extra space)
  w = Math.floor(windowWidth / size);
  h = Math.floor(windowHeight / size);
  console.log('h: ' +h)

  // Calculate the extra space
  var widthDiff = windowWidth % size;
  var heightDiff = windowHeight % size;
  console.log('heightDiff: ' + heightDiff)
  // Add the needed amount of height and width to each cell to fill the window
  var widthSize = size + widthDiff / w;
  
  var heightDiffPerCell = heightDiff / h;
  console.log(size)
  var heightSize = size + heightDiffPerCell;
  console.log('HDperCell: ' + heightDiffPerCell)
  console.log('heightSize: ' + heightSize)
  // Begin to alter the DOM
  var parentDiv = document.createElement('div');
  parentDiv.className = 'grid';  
  for(var y = 0; y < h; y++) {
    for(var x = 0; x < w; x++) {
      var cellDiv = document.createElement('div')
      cellDiv.className = 'cellDiv'
      cellDiv.style.height = heightSize + 'px'; 
      cellDiv.style.width = widthSize + 'px'; 
      parentDiv.appendChild(cellDiv)
    }
  }

  
  document.body.appendChild(parentDiv)  
  */
  </script>