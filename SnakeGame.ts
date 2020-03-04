// New interface for game coordinates
interface FieldPosition {
    x: number;
    y: number;
}

// Set HTML5 canvas and context
const canvas: HTMLCanvasElement = document.getElementById('snake_viewport') as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext('2d');

// Set images
let fieldImg: HTMLImageElement = new Image();
let appleImg: HTMLImageElement = new Image();
let snakeHeadImg: HTMLImageElement = new Image();
let snakeDiedImg: HTMLImageElement = new Image();
let snakeBodyImg: HTMLImageElement = new Image();

fieldImg.src = 'img/field.png';
appleImg.src = 'img/apple.png';
snakeHeadImg.src = 'img/snake_head.png';
snakeDiedImg.src = 'img/snake_died.png';
snakeBodyImg.src = 'img/snake_body.png';

const box: number = 32;
let score: number = 0;
let intervalValue: number = 200;
let speed: number = 1;

// Get random position in the field
function getNewPosition(): FieldPosition {
    return {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box
    }
}

function reset() {
    clearInterval(game);
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    score = 0;
    speed = 1;
    intervalValue = 200;
    direction = undefined;
    game = setInterval(drawGame, intervalValue);
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
document.addEventListener('click', reset, true);

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
            drawHead(snakeDiedImg, arr[0].x, arr[0].y);
            clearInterval(game);
        }
    }
}

function drawHead(head: HTMLImageElement, x: number, y: number): void {
    let newX = 0;
    let newY = 0;

    context.save();
    context.translate(x, y);

    if (direction == 'up') {
        context.rotate(180 * Math.PI / 180);
        newX -= box;
        newY -= box;
    }
    if (direction == 'left') {
        context.rotate(90 * Math.PI / 180);
        newY -= box;
    }
    if (direction == 'right') {
        context.rotate(270 * Math.PI / 180);
        newX -= box;
    }

    context.drawImage(head, newX, newY);
    context.restore();
}

// Main function for redraw game in canvas
function drawGame(): void {

    context.drawImage(fieldImg, 0, 0);
    context.drawImage(appleImg, apple.x, apple.y);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        if (i > 0) {
            context.drawImage(snakeBodyImg, snake[i].x + 2, snake[i].y + 2, 28, 28);
        }
        drawHead(snakeHeadImg, snake[0].x, snake[0].y);
    }

    // Draw score
    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.fillText(score.toString(), box * 2, box * 1.6);

    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.fillText(speed.toString(), box * 7, box * 1.6);

    let snakeHeadLastPosition: FieldPosition = {
        x: snake[0].x,
        y: snake[0].y
    };

    // Check if snake eats apple
    if (snakeHeadLastPosition.x == apple.x && snakeHeadLastPosition.y == apple.y) {
        score++;
        apple = getNewPosition();
        intervalValue -= 5;
        speed += 1;
        clearInterval(game);
        game = setInterval(drawGame, intervalValue);
    } else {
        // delete the last snake segment
        snake.pop();
    }

    // Check if snake overlaps the borders
    if (snakeHeadLastPosition.x == 0 || snakeHeadLastPosition.x == box * 18 || snakeHeadLastPosition.y == box * 2 || snakeHeadLastPosition.y == box * 18) {

        drawHead(snakeDiedImg, snakeHeadLastPosition.x, snakeHeadLastPosition.y);
        clearInterval(game);
    }

    if (direction == 'left') snakeHeadLastPosition.x -= box;
    if (direction == 'right') snakeHeadLastPosition.x += box;
    if (direction == 'up') snakeHeadLastPosition.y -= box;
    if (direction == 'down') snakeHeadLastPosition.y += box;

    let snakeNewHead: FieldPosition = {
        x: snakeHeadLastPosition.x,
        y: snakeHeadLastPosition.y
    };

    checkCollision(snakeHeadLastPosition, snake);

    // add (move) new snake segment to the field
    snake.unshift(snakeNewHead);
}

// Make canvas updates iterative
let game = setInterval(drawGame, intervalValue);