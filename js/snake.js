const canvas = document.querySelector("#canvas");
const paragraph = document.querySelector(".snake__p");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
};

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }

    draw(color) {
        const x = this.col * blockSize;
        const y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    isEqual(otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }
}

class Snake {
    constructor() {
        this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
        this._direction = "right";
        this._nextDirection = "right";
    }

    draw() {
        this.segments.forEach((segment) => segment.draw("#550663"));
    }

    move() {
        const head = this.segments[0];
        this._direction = this._nextDirection;
        const directions = {
            right: new Block(1, 0),
            left: new Block(-1, 0),
            down: new Block(0, 1),
            up: new Block(0, -1),
        };
        const newHead = new Block(
            head.col + directions[this._direction].col,
            head.row + directions[this._direction].row
        );

        if (this.checkCollision(newHead)) {
            this.gameOver();
            return;
        }

        this.segments.unshift(newHead);

        if (newHead.isEqual(apple.position)) {
            score++;
            apple.move();
        } else {
            this.segments.pop();
        }
    }

    checkCollision(head) {
        const wallCollision =
            head.col === 0 ||
            head.row === 0 ||
            head.col === widthInBlocks - 1 ||
            head.row === heightInBlocks - 1;

        const selfCollision = this.segments.some((segment) =>
            segment.isEqual(head)
        );

        return wallCollision || selfCollision;
    }

    setDirection(newDirection) {
        const oppositeDirections = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };

        if (newDirection !== oppositeDirections[this._direction]) {
            this._nextDirection = newDirection;
        }
    }

    gameOver() {
        clearInterval(intervalId);
        ctx.clearRect(0, 0, width, height);
        ctx.font = "60px Comic Sans MS";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", width / 2, height / 2 - 60);

        ctx.font = "36px Comic Sans MS";
        ctx.fillStyle = "Black";
        ctx.fillText("Score: " + score, width / 2, height / 2 + 20);
        ctx.fillText(
            "Snake Length: " + this.length,
            width / 2,
            height / 2 + 60
        );
        setTimeout(() => {
            startGame();
        }, 1000);
    }

    get direction() {
        return this._direction;
    }

    get nextDirection() {
        return this._nextDirection;
    }

    set nextDirection(newDirection) {
        this._nextDirection = newDirection;
    }

    get length() {
        return this.segments.length;
    }
}

class Apple {
    constructor() {
        this.position = new Block(10, 10);
    }

    draw() {
        this.position.draw("LimeGreen");
    }

    move() {
        const randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        const randomRow = Math.floor(Math.random() * (heightInBlocks - 2) + 1);
        this.position = new Block(randomCol, randomRow);
    }
}

let score = 0;
let snake = new Snake();
let apple = new Apple();
let intervalId = setInterval(updateGame, 80);

function updateGame() {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    if (score >= 0 && score < 5) {
        clearInterval(intervalId);
        intervalId = setInterval(updateGame, 60);
    } else if (score >= 5 && score < 10) {
        clearInterval(intervalId);
        intervalId = setInterval(updateGame, 40);
    } else if (score >= 10) {
        clearInterval(intervalId);
        intervalId = setInterval(updateGame, 30);
    }
}

function drawScore() {
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, blockSize, blockSize);
}

function drawBorder() {
    ctx.fillStyle = "#110014";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

document.addEventListener("keydown", (event) => {
    const newDirection = directions[event.keyCode];
    if (newDirection) {
        snake.setDirection(newDirection);
    }
});

function startGame() {
    clearInterval(intervalId);
    snake = new Snake();
    apple = new Apple();
    score = 0;
    intervalId = setInterval(updateGame, 80);
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.draw();
    apple.draw();
    drawBorder();
}

document.addEventListener("keydown", (event) => {
    const newDirection = directions[event.keyCode];
    if (newDirection) {
        snake.setDirection(newDirection);
    }

    if (event.keyCode === 13) {
        startGame();
    }
});

paragraph.addEventListener("click", function () {
    startGame();
});

// Control on phones
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let touchStartX;
let touchStartY;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 0) {
            snake.setDirection("right");
        } else {
            snake.setDirection("left");
        }
    } else {
        // Vertical movement
        if (deltaY > 0) {
            snake.setDirection("down");
        } else {
            snake.setDirection("up");
        }
    }

    touchStartX = null;
    touchStartY = null;
}

// Clear touch coordinates when a touch is complete
canvas.addEventListener("touchend", () => {
    touchStartX = null;
    touchStartY = null;
});
