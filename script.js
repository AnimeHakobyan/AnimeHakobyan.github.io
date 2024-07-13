const board = document.getElementById("game-board");
const mission = document.getElementById("mission");
const missionText = document.getElementById("mission-text");
const instractionText = document.getElementById("instruction-text");
const freeGameButton = document.getElementById("free-game-button");
const careerButton = document.getElementById("career-button");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreInHTML = document.getElementById("highScore");
const eatingSound = document.getElementById("eating-sound");
const chooseModeSound = document.getElementById("choose-mode-sound");
const levelUpSound = document.getElementById("level-up-sound");
const youWinSound = document.getElementById("you-win-sound");
const moveSound = document.getElementById("move-sound");
const gameOverSound = document.getElementById("game-over-sound");
let snake = [{
    x: 10,
    y: 10,
}];
let isGameStart = false;
let speed = 1500;
let gridSize = 20;
let food = generateFood();
let direction = "right";
let highScore = 0;
let gameIntervalId;
const missionList = [{ description: "Eat three times" },
{ description: "Eat five times" },
{ description: "Eat ten times" },
{ description: "Eat fifteen times" },
{ description: "Eat twenty times" }];
let modeVar;
let checkingMissionVar = 0;
let checkingMissionLevelVar = 0;
let speedUp = 50;
let currentMission;

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore()
};

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
};

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
};

function drawFood() {
    let foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement)
};

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
};

function move() {
    let head = { ...snake[0] };
    switch (direction) {
        case "up":
            head.y--
            break;
        case "down":
            head.y++
            break;
        case "left":
            head.x--
            break;
        case "right":
            head.x++
            break;
    };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        if (modeVar == "career") {
            checkingMissionVar++;
            checkingMission();
        };
        food = generateFood();
        eatingSound.volume = 1;
        eatingSound.play();
        clearInterval(gameIntervalId)
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, speed);
        speed -= speedUp;
    } else {
        snake.pop();
        moveSound.volume = 1;
        moveSound.play();
    };
};

function handKeyPress(event) {
    if (isGameStart == false) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        };
    };
};

function chooseMode(mode) {
    switch (mode) {
        case "free-game":
            modeVar = "free-game";
            startGame();
            break;
        case "career":
            modeVar = "career";
            startGame();
            giveMissions();
            break;
    };
    chooseModeSound.volume = 1;
    chooseModeSound.play();
};

function giveMissions() {
    missionText.style.display = "block";
    mission.innerHTML = "";
    mission.textContent = missionList[checkingMissionLevelVar].description;
    currentMission = missionList[checkingMissionLevelVar].description;
    mission.style.display = "block";
};

function checkingMission() {
    switch (currentMission) {
        case "Eat three times":
            checkingMissionCompleting(3);
            break;
        case "Eat five times":
            checkingMissionCompleting(5);
            break;
        case "Eat ten times":
            checkingMissionCompleting(10);
            break;
        case "Eat fifteen times":
            checkingMissionCompleting(15);
            break;
        case "Eat twenty times":
            checkingMissionCompleting(20);
            youWinSound.volume = 1;
            youWinSound.play();
            resetGame();
            break;
    };
};

function checkingMissionCompleting(howManyTimes) {
    if (checkingMissionVar == howManyTimes) {
        completeMission();
    };
};

function completeMission() {
    speed -= speedUp;
    checkingMissionVar = 0;
    checkingMissionLevelVar++;
    levelUpSound.volume = 1;
    levelUpSound.play();
    giveMissions();
};

function startGame() {
    isGameStart = true;
    logo.style.display = "none";
    instractionText.style.display = "none";
    careerButton.style.display = "none";
    freeGameButton.style.display = "none";
    gameIntervalId = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, speed);
};

function checkCollision() {
    let head = { ...snake[0] };
    if (head.x > gridSize || head.x < 1 || head.y > gridSize || head.y < 1) {
        resetGame();
        gameOverSound.volume = 1;
        gameOverSound.play();
    };
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            gameOverSound.volume = 1;
            gameOverSound.play();

            break;
        };
    };
};

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    speed = 1500;
    updateScore();
};

function stopGame() {
    clearInterval(gameIntervalId);
    isGameStart = false;
    logo.style.display = "block";
    instractionText.style.display = "block";
    careerButton.style.display = "block";
    freeGameButton.style.display = "block";
    if (modeVar == "career") {
        missionText.style.display = "none";
        mission.innerHTML = "";
        mission.style.display = "none";
        checkingMissionVar = 0;
        checkingMissionLevelVar = 0;
        currentMission = "";
    };
};

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0");
};

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
    };
    highScoreInHTML.textContent = highScore.toString().padStart(3, "0");
    highScoreInHTML.style.display = "block";
};

document.addEventListener("keydown", handKeyPress);
freeGameButton.addEventListener("click", (event) => {
    chooseMode("free-game")
});
careerButton.addEventListener("click", (event) => {
    chooseMode("career")
});