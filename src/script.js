const rows = 30;
const cols = 50;

const board = document.getElementById("board");

function drawGrid() {
    for (let row = 0; row < rows; row++) {
        const row = document.createElement("div");
        row.classList.add("row")

        for (let col = 0; col < cols; col++) {
            const block = document.createElement("div");
            block.classList.add("block")

            row.appendChild(block)
        }

        board.appendChild(row)
    }
}

function toggleColor(target){
    
    if (target.style.backgroundColor == "red"){
        target.style.backgroundColor = "black"
        return
    }
    
    target.style.backgroundColor = "red"
}



document.getElementById("start").addEventListener("click", () =>{
    startGameOfLife()
})

var shouldExit = false;

document.getElementById("pause").addEventListener("click", () =>{
    shouldExit = true;
})

document.getElementById("clear").addEventListener("click", () =>{
    clearBoard()
})


function clearBoard(){
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            board.children[row].children[col].style.backgroundColor = "black"
        }
    }
}

function colorBlock(){
    var blocks = document.querySelectorAll(".block");
    blocks.forEach(block => {
        block.addEventListener('click', (event) => {
            const currentBlock = event.target
            toggleColor(currentBlock)
        })
    })
}

drawGrid()
colorBlock()

function generateMatrix(target){
    let matrix = []
    for (const row of target.children) {
        let matrixRow = [];
        for (const element of row.children) {
            if (element.style.backgroundColor == "red"){
                matrixRow.push(1);
            }
            else{
                matrixRow.push(0)
            }
        }
        
        matrix.push(matrixRow)
    }

    return matrix
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

function updateBoard(target, future){
    for (let row = 0; row < future.length; row++) {
        for (let col = 0; col < future.length; col++) {
            if (future[row][col] == 1){
                target.children[row].children[col].style.backgroundColor = "red"
            }
            else{
                target.children[row].children[col].style.backgroundColor = "black"
            }
        }
    }
}



function startGameOfLife(){
    var refreshId = setInterval(() => {
        const matrix = generateMatrix(board)
        const nextGen = nextGeneration(matrix, rows, cols)
        updateBoard(board, nextGen)
        if (shouldExit){
            shouldExit = false;
            clearInterval(refreshId)
        }
    }, 200);
}



