class SnakeGame {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor() {
        let canvas = document.getElementById("snake_viewport") as HTMLCanvasElement;
        let context = canvas.getContext('2d');


    }
}

new SnakeGame();