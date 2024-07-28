let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playerX, playerY;
let score = 0;
let lives = 3; // Player starts with 3 lives
let enemies = []; // Track enemy positions
let points = 0; // Track total points in the maze
let maxScore = document.querySelectorAll('.point').length;

const main = document.querySelector('main');
const scoreDisplay = document.querySelector('.score p');
const livesList = document.querySelector('.lives ul'); // List to display lives
const startDiv = document.querySelector('.startDiv');
const startButton = document.querySelector('.start');

let mazes = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 1, 0, 0, 3, 0, 3, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];
let currentMazeIndex = 0;
let maze = mazes[currentMazeIndex];

function renderMaze() {
    main.innerHTML = '';
    enemies = []; // Reset enemies array
    points = 0; // Reset points count

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            let block = document.createElement('div');
            block.classList.add('block');

            switch (maze[y][x]) {
                case 1:
                    block.classList.add('wall');
                    break;
                case 2:
                    block.id = 'player';
                    let mouth = document.createElement('div');
                    mouth.classList.add('mouth', 'right'); // Initial direction
                    block.appendChild(mouth);
                    playerX = x;
                    playerY = y;
                    break;
                case 3:
                    block.classList.add('enemy');
                    enemies.push({ x, y }); // Store enemy positions
                    break;
                case 0:
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
                    points++;
                    break;
                default:
                    break;
            }

            main.appendChild(block);
        }
    }
}

function keyUp(event) {
    if (event.key === 'ArrowUp') upPressed = false;
    else if (event.key === 'ArrowDown') downPressed = false;
    else if (event.key === 'ArrowLeft') leftPressed = false;
    else if (event.key === 'ArrowRight') rightPressed = false;
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
        movePlayer('up');
    }
    else if (event.key === 'ArrowDown') {
        downPressed = true;
        movePlayer('down');
    }
    else if (event.key === 'ArrowLeft') {
        leftPressed = true;
        movePlayer('left');
    }
    else if (event.key === 'ArrowRight') {
        rightPressed = true;
        movePlayer('right');
    }
}
function checkPointCollision() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');

    if (points.length === 0) {
        if (confirm('Congratulations! You have collected all points. Your total score was ' + score + '. Do you want to play again?')) {
            console.log('All points collected. Reloading game.');
            setTimeout(() => {
            window.location.reload();
            }, 1);
        }
    }

    for (let point of points) {
        const pointRect = point.getBoundingClientRect();

        if (
            playerRect.top < pointRect.bottom &&
            playerRect.bottom > pointRect.top &&
            playerRect.left < pointRect.right &&
            playerRect.right > pointRect.left
        ) {
            // Collision detected with point
            console.log('Point collected');
            point.classList.remove('point');
            score += 10;
            document.querySelector('.score p').textContent = score;
        }
    }
}

function movePlayer(direction) {
    let newX = playerX;
    let newY = playerY;

    switch (direction) {
        case 'up':
            newY--;
            break;
        case 'down':
            newY++;
            break;
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
    }

    if (maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1 && maze[newY][newX] !== 3) {
        if (maze[newY][newX] === 0) {
            score++;
            points--;
            updateScore();
        }

        maze[playerY][playerX] = 0;
        maze[newY][newX] = 2;
        playerX = newX;
        playerY = newY;

        renderMaze();
        updateMouthDirection(direction);

        if (points === 0) {
            advanceToNextLevel();
        }
    }

    if (maze[newY][newX] === 3) {
        lives--;
        updateLives();
        if (lives <= 0) {
            alert('Game Over!');
            location.reload();
        } else {
            maze[playerY][playerX] = 0;
            playerX = 1;
            playerY = 1;
            maze[playerY][playerX] = 2;
            renderMaze();
        }
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let newX = enemy.x;
        let newY = enemy.y;
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];

        switch (direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

        // Check if the new position is not a wall (1), enemy (3), or out of bounds
        if (maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1 && maze[newY][newX] !== 3) {
            maze[enemy.y][enemy.x] = 0;
            maze[newY][newX] = 3;
            enemy.x = newX;
            enemy.y = newY;
        }
    });

    renderMaze();
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateLives() {
    livesList.innerHTML = ''; // Clear current lives display
    for (let i = 0; i < lives; i++) {
        let life = document.createElement('li');
        livesList.appendChild(life);
    }
}

function updateMouthDirection(direction) {
    const player = document.getElementById('player');
    const mouth = player.querySelector('.mouth');
    mouth.classList.remove('up', 'down', 'left', 'right');
    mouth.classList.add(direction);
}

function advanceToNextLevel() {
    if (currentMazeIndex < mazes.length - 1) {
        currentMazeIndex++;
        maze = mazes[currentMazeIndex];
        renderMaze();
    } else {
        alert('Congratulations! You have completed this level!');
        location.reload();
    }
}

startButton.addEventListener('click', function() {
    renderMaze();
    startDiv.style.display = 'none';
    setInterval(moveEnemies, 1000); // Move enemies every second
    updateLives(); // Initialize lives display
});

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

document.getElementById('lbttn').addEventListener('mousedown', () => { movePlayer('left'); leftPressed = true; });
document.getElementById('lbttn').addEventListener('mouseup', () => { leftPressed = false; });
document.getElementById('ubttn').addEventListener('mousedown', () => { movePlayer('up'); upPressed = true; });
document.getElementById('ubttn').addEventListener('mouseup', () => { upPressed = false; });
document.getElementById('rbttn').addEventListener('mousedown', () => { movePlayer('right'); rightPressed = true; });
document.getElementById('rbttn').addEventListener('mouseup', () => { rightPressed = false; });
document.getElementById('dbttn').addEventListener('mousedown', () => { movePlayer('down'); downPressed = true; });
document.getElementById('dbttn').addEventListener('mouseup', () => { downPressed = false; });
