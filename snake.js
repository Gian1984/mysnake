/* ---Direction — The snake is moving either left, right, up or down. We can store this as strings 'Up', 'Down', 'Left' and ‘Right’.
   ---Position — Defined as a X and Y position on the board. Note that 0, 0 will be top left on the board and 25, 15 will be bottom right.
   ---Length — Length of the snake in segments.
 */

// The board will be represented as a two-dimensional array, that is, an array of arrays.
const board = [];
const boardWidth = 26,
    boardHeight = 16;

/* ---Direction — The snake is moving either left, right, up or down. We can store this as strings 'Up', 'Down', 'Left' and ‘Right’.
   ---Position — Defined as a X and Y position on the board. Note that 0, 0 will be top left on the board and 25, 15 will be bottom right.
   ---Length — Length of the snake in segments.
 */
let snakeX;
let snakeY;
let snakeLength;
let snakeDirection;

//--the entire board out of div elements, and will style these to look like cells, apples and the snake. 
//--We create these divs by iterating over the Y and X axes, creating columns and rows of items:

function initGame() {
    const boardElement = document.getElementById('board');

    for (let y = 0; y < boardHeight; ++y) {
        let row = [];
        for (let x = 0; x < boardWidth; ++x) {
            //--To keep track of the tail, we store the information about the tail in the board. So we’ll add a property snake to every 
            //--cell on the board.We’ll give it an integer value of 0 to denote that the snake is not on the space (at the start of the game).

            let cell = {};

            //--For every cell, we create a div element on the board via document.createElement. 
            //--Then we add this cell to the boardElement, meaning every cell will have a matching div in the DOM.

            // Create a <div></div> and store it in the cell object
            cell.element = document.createElement('div');

            // Add it to the board
            boardElement.appendChild(cell.element);

            //--We need to store all these cells inside the board array of arrays. We do this by creating an array 
            //--for every row, and pushing the cells into this row in the inner loop, and every row into the board
            //--array for every outer loop


            // Add to list of all
            row.push(cell);
        }

        // Add this row to the board
        board.push(row);
    }
    //Add a call to startGame for initGame 
    startGame();

    // Start the game loop (it will call itself with timeout)
    gameLoop();
}

// initGame will only run once for the entire application, but startGame will run multiple times.

function startGame() {

    // Default position for the snake in the middle of the board. Since if the board width is 25, 12.5 is not a meaningful position on 
    //the grid, divide width and height by 2
    snakeX = Math.floor(boardWidth / 2);
    snakeY = Math.floor(boardHeight / 2);
    snakeLength = 5;
    snakeDirection = 'Up';

    // Clear the board
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            board[y][x].snake = 0; // clear the snake when restart
            board[y][x].apple = 0; // clear the apple when restart 
        }
    }

    // Set the center of the board to contain a snake
    board[snakeY][snakeX].snake = snakeLength;

    placeApple()
}

//Even when the user is just looking at the screen. The code that runs constantly in the background, is called the game loop.
function gameLoop() {
    // Update position depending on which direction the snake is moving.

    /* We have the snakeDirection global variable to define the direction the snake is heading,
     right now it always has the value "Up", but we also need to check for "Left", "Right", "Down". 
     For each direction, we change the value of either snakeX or snakeY by 1. Changing snakeY will move 
     the snake either up or down, changing snakeX will move the snake left or right.
     Remember that snakeX = 0 and snakeY = 0 is the upper left of the board. So to make the snake move right,
     we increase snakeX. To make it go down, we increase snakeY. And the reverse for left and up. In code, it looks like this:
    */
    switch (snakeDirection) {
        case 'Up':
            snakeY--;
            break;
        case 'Down':
            snakeY++;
            break;
        case 'Left':
            snakeX--;
            break;
        case 'Right':
            snakeX++;
            break;
    }
    // Check for walls, and restart if we collide with any
    if (snakeX < 0 || snakeY < 0 || snakeX >= boardWidth || snakeY >= boardHeight) {
        startGame()
    }

    // Tail collision. Check if the snake property is set. If it is, we just restart the game. 
    if (board[snakeY][snakeX].snake > 0) {
        startGame();
    }

    // Collect apples. Verify the collision with apple 
    if (board[snakeY][snakeX].apple === 1) {
        snakeLength++;
        board[snakeY][snakeX].apple = 0;
        placeApple();
    }

    // Update the board at the new snake position
    board[snakeY][snakeX].snake = snakeLength;

    // Loop over the entire board, and update every cell. We do this by looping over the Y and X axes, and checking if the board 
    //has a snake, if so, we set the element’s class to "snake". Else we remove any class set.

    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            let cell = board[y][x];

            if (cell.snake > 0) {
                cell.element.className = 'snake';
                cell.snake -= 1;
            } else if (cell.apple === 1) {
                cell.element.className = 'apple';
            } else {
                cell.element.className = '';
            }
        }
    }

    // The setTimeout call will repeat function again, recursively. Function calls itself, with a timeout of 1000 milliseconds
    setTimeout(gameLoop, 300);
}

//--Input will be done using the keyboard (sorry, mobile readers). To capture this we need to bind the onKeyDown event. 
//--We check what key was pressed and update the snakeDirection accordingly. We create a new function
function enterKey(event) {
    // Update direction depending on key hit
    switch (event.key) {
        case 'ArrowUp':
            snakeDirection = 'Up';
            break;
        case 'ArrowDown':
            snakeDirection = 'Down';
            break;
        case 'ArrowLeft':
            snakeDirection = 'Left';
            break;
        case 'ArrowRight':
            snakeDirection = 'Right';
            break;
        default:
            return;
    }

    // This prevents the arrow keys from scrolling the window
    event.preventDefault();
}

function placeApple() {
    // A random coordinate for the apple
    let appleX = Math.floor(Math.random() * boardWidth);
    let appleY = Math.floor(Math.random() * boardHeight);

    board[appleY][appleX].apple = 1;
}