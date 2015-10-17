

/****** Turn it on ******/
  function playing() {
    setTimeout(Engine.updateCells(), 2000)
  }
  var randoArr = Engine.randomArr(15)
  Engine.printInitialGrid(15, randoArr)
  window.setInterval(function() {
    if(Engine.uI.play) playing()
  }, 50  )