// Constants 
const cvs = document.getElementById("board"),
    ctx = cvs.getContext("2d");
    ctx.scale(20,20);
    ctx.translate(0.5/20,0.5/20);

var Tetromino = {
    x : 0,
    y: 0,
    shapeNumber: random(0,7),
    blockNumber: random(0,4), 
};


// Board Matrix 
var board = [];
resetBoard();

var score = 0;

//------------------------------------------------------------------
// HELPER FUNCTIONS 
//------------------------------------------------------------------

function random(min, max) { return min + Math.floor(Math.random()*(max-min))       }

function collide(board, piece){
    // Collision detection function 
    let shape = shapes[piece.shapeNumber].blocks[piece.blockNumber];

    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < shape[y].length; ++x) {
            if (shape[y][x] !== 0 &&
               (board[y + piece.y] &&
                board[y + piece.y][x + piece.x]) !== null) {
                return true;
            }
        }
    }

    return false;
}

function merge(board, piece){
    let map = shapes[piece.shapeNumber].blocks[piece.blockNumber];
    map.forEach((row, y) =>{
        row.forEach((block, x)=>{
            if (block !== 0){
                board[y+piece.y][x+piece.x] = piece.shapeNumber;
            }
        });
    });
}

function drawBlock(x, y, color){
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.05; 
    ctx.strokeRect(x, y, 1, 1);
    ctx.fillRect(x, y, 1, 1);
}


//------------------------------------------------------------------
// BOARD FUNCTIONS 
//------------------------------------------------------------------

function resetBoard(){
    board = [];
    for (let i = 0; i < 20; i++){
        board.push(new Array(10).fill(null));
    }
}

function updateBoard(){
    // If line is full 
    // it clears this line
    for (let i = 0; i < board.length; i++){
        if (!board[i].includes(null)){
            board.splice(i, 1);
            board.unshift(new Array(10).fill(null));
            score+=10;
        }
    }
}

function drawBoard(board){
    let map =  board;
    map.forEach( (row, r) => {
        row.forEach( (block, b) => {
            if (block !== null){
                drawBlock(b, r, shapes[block].color); 
            }
        });
        
    });
}



// PIECE FUNCTIONS -=-=-=--=-=-=--=-=-=--=-=-=--=-=-=--=-=-=--=-=-=-

function drop(piece){
    piece.y++;
   
    if (collide(board, piece)){           
        piece.y--;
        merge(board, piece);
        resetPiece(piece);
    }

    dropCounter = 0;
}

function rotate(piece){    
    if (piece.blockNumber !== 3){
        piece.blockNumber++;
        if (collide(board, piece)){
            piece.blockNumber--;
        }
    }

    else{
        piece.blockNumber = 0;
        if (collide(board, piece)){
            piece.blockNumber = 3;
        }
    }
}


function draw(){
    ctx.clearRect(0,0,200,400);
    drawPiece(current);
    drawBoard(board);
}


function resetPiece(piece){
    pickLocation(piece);
    piece.shapeNumber = random(0,7);
    piece.blockNumber = random(0,4);
    if (collide(board, piece)){
        resetBoard();
        pickLocation(piece);
        score = 0;
    }
}
function pickLocation(piece) {
    // TODO: implementing better location picker 
    piece.x = random(0, 6);
    piece.y = 0;
}
function drawPiece(piece){
    let map = shapes[piece.shapeNumber].blocks[piece.blockNumber] || board;
    let color = shapes[piece.shapeNumber].color || 'black';
    map.forEach( (row, r) => {
        row.forEach( (block, b) => {
            if (block === 1){
                drawBlock(b + piece.x, r + piece.y, color);
            }
        });
        
    });
}




// Game Loop
var lastTime = 0;
var dropInterval = 600;
var dropCounter = 0;

function update(time = 0){
    var deltaTime = time - lastTime;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval){
        drop(current);
    }

    document.getElementById("scoreboard").innerHTML = score;
    updateBoard();
    draw();
    lastTime = time;

    requestAnimationFrame(update);
}



var current = Object.create(Tetromino),
    next = Object.create(Tetromino);

document.addEventListener("keydown", (event)=>{
    if (event.keyCode === 37){
        current.x--;
        if (collide(board, current)){
            current.x++;
        }
    }
    else if (event.keyCode === 38 && !collide(board, current)){
        rotate(current);
    }
    else if (event.keyCode === 39){
        current.x++;
        if (collide(board, current)){
            current.x--;
        }
    }
    else if(event.keyCode === 40){
        drop(current);
    }
});

pickLocation(current);
update();

