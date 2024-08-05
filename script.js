
document.addEventListener('DOMContentLoaded', function (event) {
    var startDiv = document.querySelector('.startDiv'),
        startButton = document.querySelector('.start'),
        main = document.querySelector('main'),
        scoreElement = document.querySelector('.score p'),
        livesElement = document.querySelector('.lives ul'),
        controls = document.querySelectorAll('.controls button'),
        upPressed = false,
        downPressed = false,
        leftPressed = false,
        rightPressed = false,
        playerX, playerY,
        score = 0,
        lives = 3,
        enemies = [],
        totalPoints = 0,
        remainingPoints = 0,
        beginningSound = new Audio('as2_pacman_beginning.mp3'),
        deathSound = new Audio('as2_pacman_death.mp3'),
        intermissionSound = new Audio('as2_pacman_intermission.mp3'),
        lifeSound = new Audio('as2_Lost-life-sound-effect.mp3'),
        points = [], // Separate array to track points
        mazes = [
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
        ],
        currentMazeIndex = 0,
        maze = mazes[currentMazeIndex];

    function renderMaze() {
        main.innerHTML = '';
        enemies = [];
        points = []; // Reset points array
        totalPoints = 0;
        remainingPoints = 0;

        for (var y = 0; y < maze.length; y++) {
            for (var x = 0; x < maze[y].length; x++) {
                var block = document.createElement('div');
                block.classList.add('block');

                if (maze[y][x] === 1) {
                    block.classList.add('wall');
                } else if (maze[y][x] === 2) {
                    block.id = 'player';
                    block.classList.add('player');
                    var mouth = document.createElement('div');
                    mouth.classList.add('mouth', 'right');
                    block.appendChild(mouth);
                    playerX = x;
                    playerY = y;
                } else if (maze[y][x] === 3) {
                    block.classList.add('enemy');
                    enemies.push({ x: x, y: y });
                } else if (maze[y][x] === 0) {
                    // Check if it's a starting position for the player or an enemy before placing a point
                    if (!((x === playerX && y === playerY) || enemies.some(enemy => enemy.x === x && enemy.y === y))) {
                        block.classList.add('point');
                        block.style.height = '1vh';
                        block.style.width = '1vh';
                        remainingPoints++;
                        totalPoints++;
                        points.push({ x: x, y: y }); // Track point position
                    }
                }

                main.appendChild(block);
            }
        }
    }

    function keyUp(event) {
        if (event.key === 'ArrowUp') {
            upPressed = false;
        } else if (event.key === 'ArrowDown') {
            downPressed = false;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = false;
        } else if (event.key === 'ArrowRight') {
            rightPressed = false;
        }
    }

    function keyDown(event) {
        if (event.key === 'ArrowUp') {
            upPressed = true;
            movePlayer('up');
        } else if (event.key === 'ArrowDown') {
            downPressed = true;
            movePlayer('down');
        } else if (event.key === 'ArrowLeft') {
            leftPressed = true;
            movePlayer('left');
        } else if (event.key === 'ArrowRight') {
            rightPressed = true;
            movePlayer('right');
        }
    }

    function checkPointCollision(newX, newY) {
        // Check if the player collects a point
        var pointIndex = points.findIndex(point => point.x === newX && point.y === newY);
        if (pointIndex !== -1) {
            score += 5;
            remainingPoints--;
            updateScore();

            // Remove the point from the points array
            points.splice(pointIndex, 1);

            // Trigger an event when a point is collected
            var pointCollectedEvent = new CustomEvent('pointCollected', { detail: { score: score } });
            document.dispatchEvent(pointCollectedEvent);

            if (remainingPoints === 0) {
                advanceToNextLevel();
            }
        }
    }

    function movePlayer(direction) {
        var newX = playerX;
        var newY = playerY;

        if (direction === 'up') {
            newY--;
        } else if (direction === 'down') {
            newY++;
        } else if (direction === 'left') {
            newX--;
        } else if (direction === 'right') {
            newX++;
        }

        // Check for walls and coins (points)
        var validMove = maze[newY] && maze[newY][newX] !== undefined &&
            maze[newY][newX] !== 1;

        if (validMove) {
            if (maze[newY][newX] !== 3) {
                checkPointCollision(newX, newY); // Check for coin collision

                maze[playerY][playerX] = -1; // Empty the previous position
                maze[newY][newX] = 2; // Move player to new position
                playerX = newX;
                playerY = newY;

                renderMaze();
                updateMouthDirection(direction);
            } else {
                handleDeath();
            }
        }
    }

    function moveEnemies() {
        enemies.forEach(function (enemy) {
            var newX = enemy.x;
            var newY = enemy.y;
            var direction = Math.floor(Math.random() * 4);
            if (direction === 0) {
                newY--;
            } else if (direction === 1) {
                newY++;
            } else if (direction === 2) {
                newX--;
            } else if (direction === 3) {
                newX++;
            }

            var validMove = maze[newY] && maze[newY][newX] !== undefined &&
                maze[newY][newX] !== 1 && maze[newY][newX] !== 3;

            if (validMove) {
                maze[enemy.y][enemy.x] = -1;
                maze[newY][newX] = 3;
                enemy.x = newX;
                enemy.y = newY;
            }

            renderMaze();
        });
    }

    function updateMouthDirection(direction) {
        var playerElement = document.getElementById('player');
        var mouth = playerElement.querySelector('.mouth');

        mouth.classList.remove('up', 'down', 'left', 'right');
        mouth.classList.add(direction);
    }

    function updateScore() {
        scoreElement.textContent = 'Score: ' + score;
    }

    function updateLives() {
        livesElement.innerHTML = '';

        for (var i = 0; i < lives; i++) {
            var life = document.createElement('li');
            livesElement.appendChild(life);
        }
    }

    function advanceToNextLevel() {
        intermissionSound.play();

        setTimeout(function () {
            currentMazeIndex++;
            if (currentMazeIndex < mazes.length) {
                maze = mazes[currentMazeIndex];
                renderMaze();
            } else {
                alert('Congratulations! You completed all levels!');
                location.reload();
            }
        }, 2000);
    }

    function handleDeath() {
        var playerElement = document.getElementById('player');

        // Add death animation
        playerElement.style.transition = 'transform 1s, opacity 1s';
        playerElement.style.transform = 'scale(0)';
        playerElement.style.opacity = '0';

        deathSound.play();

        setTimeout(function () {
            playerElement.style.transform = 'scale(1)';
            playerElement.style.opacity = '1';
            lives--;
            updateLives();

            if (lives <= 0) {
                handleGameOver();
            } else {
                maze[playerY][playerX] = -1;
                // Respawn player at last known position instead of starting position
                maze[playerY][playerX] = 2;
                renderMaze();
            }
        }, 1000);
    }

    function handleGameOver() {
        var mainElement = document.querySelector('main');

        // Add game-over animation
        mainElement.style.transition = 'background-color 3s, opacity 3s';
        mainElement.style.backgroundColor = 'black';
        mainElement.style.opacity = '0';

        setTimeout(function () {
            alert('Game Over!');
            location.reload();
        }, 3000);
    }

    startButton.addEventListener('click', function () {
        startDiv.style.display = 'none';
        beginningSound.play();
        renderMaze();
        updateScore();
        updateLives();
    });

    setInterval(moveEnemies, 1000);
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
});
