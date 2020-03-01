// New interface for game coordinates
interface FieldPosition {
    x: number;
    y: number;
}

// Set HTML5 canvas and context
const canvas: HTMLCanvasElement = document.getElementById("snake_viewport") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext('2d');

// Set images
var fieldImg: HTMLImageElement = new Image();
var appleImg: HTMLImageElement = new Image();
fieldImg.src = "img/field.png";
appleImg.src = "img/apple.png";

const box: number = 32;
var score: number = 0;

// Get random position in the field
function getNewPosition(): FieldPosition {
    return {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box
    }
}

// Initialize apple instance
let apple: FieldPosition = getNewPosition();

// Initialize snake instance
let snake = Array<FieldPosition>();

// Create first segment
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// Set listener for arrow control
document.addEventListener('keydown', setDirection);

let direction: string;

function setDirection(event): void {

    if (event.code == 'ArrowLeft' && direction != 'right') {
        direction = 'left';
    }
    if (event.code == 'ArrowUp' && direction != 'down') {
        direction = 'up';
    }
    if (event.code == 'ArrowRight' && direction != 'left') {
        direction = 'right';
    }
    if (event.code == 'ArrowDown' && direction != 'up') {
        direction = 'down';
    }
}

function checkCollision(head: FieldPosition, arr: Array<FieldPosition>) {
    for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) == JSON.stringify(head)) {
            clearInterval(game);
        }
    }
}

// Main function for redraw game in canvas
function drawGame(): void {

    context.drawImage(fieldImg, 0, 0);
    context.drawImage(appleImg, apple.x, apple.y);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = i == 0 ? 'yellow' : 'green';
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw score
    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.fillText(score.toString(), box * 2, box * 1.7);

    let snakeLastPosition: FieldPosition = {
        x: snake[0].x,
        y: snake[0].y
    };

    // Check if snake eats apple
    if (snakeLastPosition.x == apple.x && snakeLastPosition.y == apple.y) {
        score++;
        apple = getNewPosition();
    } else {
        // delete the last snake segment
        snake.pop();
    }

    // Check if snake overlaps the borders
    if (snakeLastPosition.x == 0 || snakeLastPosition.x == box * 18 || snakeLastPosition.y == box * 2 || snakeLastPosition.y == box * 18) {
        context.fillStyle = 'red';
        context.fillRect(snakeLastPosition.x, snakeLastPosition.y, box, box);
        clearInterval(game);
    }


    if (direction == 'left') snakeLastPosition.x -= box;
    if (direction == 'right') snakeLastPosition.x += box;
    if (direction == 'up') snakeLastPosition.y -= box;
    if (direction == 'down') snakeLastPosition.y += box;

    let snakeNewHead: FieldPosition = {
        x: snakeLastPosition.x,
        y: snakeLastPosition.y
    };

    checkCollision(snakeLastPosition, snake);

    // add (move) new snake segment to the field
    snake.unshift(snakeNewHead);
}

// Make canvas updates iterative
let game = setInterval(this.drawGame, 100);