const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerWidth,
});

const layer = new Konva.Layer();
stage.add(layer);

const grid = new Konva.Group({
  draggable: true,
});

const squareSize = 60; // Change this to adjust grid size
let zoomLevel = 0.1;
const minZoom = 0.3; // Set your minimum zoom level here

drawGrid(60, 120);

let lastPosX, lastPosY;
let isDragging = false;

stage.on('wheel', (e) => {
  e.evt.preventDefault();
  
  const cursorPoint = stage.getPointerPosition();

  const oldScale = grid.scaleX();

  const mousePointTo = {
    x: (cursorPoint.x - grid.x()) / oldScale,
    y: (cursorPoint.y - grid.y()) / oldScale,
  };

  let newScale = oldScale;

  if (e.evt.deltaY > 0) {
    newScale = Math.max(oldScale * 0.9, minZoom);
  } else {
    newScale = Math.max(oldScale * 1.1, minZoom);
  }

  grid.scale({ x: newScale, y: newScale });

  const newPos = {
    x: cursorPoint.x - mousePointTo.x * newScale,
    y: cursorPoint.y - mousePointTo.y * newScale,
  };

  grid.position(newPos);

  layer.batchDraw();
});

stage.on('mousedown touchstart', (e) => {
  const pos = stage.getPointerPosition();
  lastPosX = pos.x;
  lastPosY = pos.y;
  isDragging = true;
});

stage.on('mousemove touchmove', (e) => {
  if (isWithinGridBoundaries(lastPosX, lastPosY)){
    
  if (!isDragging) {
    return;
  }

  const pos = stage.getPointerPosition();
  const dx = pos.x - lastPosX;
  const dy = pos.y - lastPosY;

  grid.x(grid.x() + dx / zoomLevel);
  grid.y(grid.y() + dy / zoomLevel);

  lastPosX = pos.x;
  lastPosY = pos.y;

  layer.batchDraw();
}

});

stage.on('mouseup touchend', () => {
  isDragging = false;
});

document.getElementById("start").addEventListener("click", () =>{

  setInterval(() => {
    let matrix = generateMatrix(grid.getChildren(), 60, 120);
    let rows = matrix.length;
    let cols = matrix[0].length;

    let nextGen = nextGeneration(matrix, rows, cols)

    updateGrid(nextGen)
  }, 150);
});

function updateGrid(nextGen){
  var singleLineArray = nextGen.flat(1)
  var index = 0;
  grid.getChildren().forEach(c => {
    c.fill(singleLineArray[index] === 1 ? 'black' : 'white');
    index++;
  })
}

function nextGeneration(grid, M, N){
     
  let future = new Array(M);
  for(let i = 0; i < M; i++){
      future[i] = new Array(N).fill(0);
  }

  // Loop through every cell
  for(let l=0;l<M;l++){
      for(let m=0;m<N;m++){
           
          // finding no Of Neighbours that are alive
          let aliveNeighbours = 0
          for(let i = -1; i < 2; i++)
          {
              for(let j = -1; j < 2; j++)
              {
                  if ((l + i >= 0 && l + i < M) && (m + j >= 0 && m + j < N))
                      aliveNeighbours += grid[l + i][m + j]
              }
          }

          // The cell needs to be subtracted from
          // its neighbours as it was counted before
          aliveNeighbours -= grid[l][m]

          // Implementing the Rules of Life

          // Cell is lonely and dies
          if ((grid[l][m] == 1) && (aliveNeighbours < 2))
              future[l][m] = 0

          // Cell dies due to over population
          else if ((grid[l][m] == 1) && (aliveNeighbours > 3))
              future[l][m] = 0

          // A new cell is born
          else if ((grid[l][m] == 0) && (aliveNeighbours == 3))
              future[l][m] = 1

          // Remains the same
          else
              future[l][m] = grid[l][m]
      }
  }

  return future
}

function generateMatrix(array, rows, cols) {
  var resultMatrix = [];
  var arrayIndex = 0;
  for (let row = 0; row < rows; row++){
    var currRow = []
    for (let col = 0; col < cols; col++){
      array[arrayIndex].attrs.fill === 'black' ? currRow.push(1) : currRow.push(0);
      arrayIndex++;
    }

    resultMatrix.push(currRow);
  }

  return resultMatrix; 
}

function isWithinGridBoundaries(pX, pY) {
  const gridPos = grid.getClientRect();
  return (
    pos.x >= pX &&
    pos.x <= pX + gridPos.width &&
    pos.y >= pY &&
    pos.y <= pY + gridPos.height
  );
}

function drawGrid(rows, cols) {
  grid.destroyChildren();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const square = new Konva.Rect({
        x: j * squareSize,
        y: i * squareSize,
        width: squareSize,
        height: squareSize,
        fill: 'white',
        stroke: '#B8B8B8',
        strokeWidth: 1,
      });

      square.on('click', () => {
        if (square.fill() === 'white') {
          square.fill('black');
        } else {
          square.fill('white');
        }
        layer.batchDraw();
      });

      grid.add(square);
    }
  }

  grid.x(-200);

  grid.scaleX(0.5);
  grid.scaleY(0.5);


  layer.add(grid);
  layer.batchDraw();
}