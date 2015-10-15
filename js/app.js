

/****** Turn it on ******/
  function playing() {
    setTimeout(Engine.updateCells(), 2000)
  }
  var randoArr = Engine.randomArr(10)
  Engine.printInitialGrid(10, randoArr)
  window.setInterval(function() {
    if(Engine.uI.play) playing()
  }, 50  )