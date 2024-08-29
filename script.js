<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    // Get elements by class name, tag name, or ID
    const startDiv = document.getElementsByClassName('startDiv')[0];
    const startButton = document.getElementsByClassName('start')[0];
    const main = document.getElementsByTagName('main')[0];
    const scoreElement = document.querySelector('.score p');
    const livesElement = document.querySelector('.lives ul');
    const skipButton = document.getElementsByClassName('skipLevel')[0];
    const pauseButton = document.getElementsByClassName('pause')[0];
    const restartButton = document.getElementsByClassName('restart')[0];
    const leaderboardContainer = document.getElementsByClassName('leaderboard')[0];
    const leaderboardList = document.querySelector('.leaderboard ul');
    const clearLeaderboardButton = document.getElementsByClassName('clear-leaderboard')[0];
    const muteButton = document.getElementsByClassName('mute')[0];

    // Game state variables
    let isPaused = false,
        isMuted = false,
        isMoving = true,
        isInvincible = false,
        gameStarted = false;

    // Player and game variables
    let playerX, playerY,
        score = 0,
        lives = 3,
        enemies = [],
        remainingPoints = 0,
        points = [],
        maze,
        level = 1,
        enemyInterval,
        currentLevel = 1;

    // Sound effects
    const sounds = {
        beginning: new Audio('as2_pacman_beginning.mp3'),
        death: new Audio('as2_pacman_death.mp3'),
        intermission: new Audio('as2_pacman_intermission.mp3'),
        point: new Audio('as2_Coin_collection.mp3')
    };

    // Movement delays
    const delays = {
        enemyMove: 2000,
        playerMove: 100
    };

    // Generate a maze for the given level
    const generateMaze = (level) => {
        const size = 10;
        let newMaze = [];

        // Create maze structure with walls and open spaces
        const createMaze = () => {
            newMaze = [];
            for (let y = 0; y < size; y++) {
                const row = [];
                for (let x = 0; x < size; x++) {
                    row.push((y === 0 || y === size - 1 || x === 0 || x === size - 1) ? 1 : (Math.random() < 0.2 ? 1 : 0));
                }
                newMaze.push(row);
            }
            newMaze[1][1] = 2; // Place player at a fixed position
        };

        // Place enemies randomly in the maze
        const placeEnemies = () => {
            const numberOfEnemies = Math.min(level, 5);
            for (let i = 0; i < numberOfEnemies; i++) {
                let enemyPlaced = false;
                while (!enemyPlaced) {
                    const x = Math.floor(Math.random() * (size - 2)) + 1;
                    const y = Math.floor(Math.random() * (size - 2)) + 1;
                    if (newMaze[y][x] === 0) {
                        newMaze[y][x] = 3;
                        enemies.push({ x, y, direction: randomDirection() });
                        enemyPlaced = true;
                    }
                }
            }
        };

        // Check if all points in the maze are reachable using BFS
        const bfsCheck = () => {
            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 },
            ];
            const visited = Array.from({ length: size }, () => Array(size).fill(false));
            const queue = [{ x: 1, y: 1 }];
            visited[1][1] = true;

            while (queue.length > 0) {
                const { x, y } = queue.shift();
                for (const { dx, dy } of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[ny][nx] && newMaze[ny][nx] !== 1) {
                        visited[ny][nx] = true;
                        queue.push({ x: nx, y: ny });
                    }
                }
            }

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (newMaze[y][x] === 0 && !visited[y][x]) {
                        return false;
                    }
                }
            }
            return true;
        };

        // Generate and validate the maze
        do {
            createMaze();
            placeEnemies();
        } while (!bfsCheck());

        // Track points in the maze
        pointsArray = [];
        newMaze.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) {
                    pointsArray.push({ x, y });
                }
            });
        });

        return newMaze;
    }

    // Display the leaderboard
    const showLeaderboard = () => {
        leaderboardContainer.style.display = 'block';
        leaderboardContainer.style.marginTop = '0px';
        leaderboardList.style.listStyleType = 'none';
        leaderboardList.style.paddingLeft = '0';
        leaderboardList.style.marginTop = '10px';
        const leaderboard = getLeaderboard();
        leaderboardList.innerHTML = leaderboard
            .map((entry, index) => `<li style="margin-bottom: 10px;">${index + 1}. ${entry.name} - ${entry.score}</li>`)
            .join('');
    };

    // Retrieve leaderboard from local storage
    const getLeaderboard = () => JSON.parse(localStorage.getItem('leaderboard') || '[]');

    // Save leaderboard to local storage
    const saveLeaderboard = (leaderboard) => {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    };

    // Add a new entry to the leaderboard
    const addToLeaderboard = (name, score) => {
        const leaderboard = [...getLeaderboard(), { name, score }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        saveLeaderboard(leaderboard);
        showLeaderboard();
    };

    // Prompt for player's name and save the score
    const promptForNameAndSave = (score) => {
        const playerName = prompt('Enter your name:', 'Player');
        if (playerName) addToLeaderboard(playerName, score);
    };

    // Clear the leaderboard
    const clearLeaderboard = () => {
        localStorage.removeItem('leaderboard');
        showLeaderboard();
    };

    // Render the maze on the screen
    const renderMaze = () => {
        main.innerHTML = '';
        enemies = [];
        remainingPoints = 0;
        points = [];

        maze.forEach((row, y) => {
            row.forEach((cell, x) => {
                const block = document.createElement('div');
                block.classList.add('block');

                if (cell === 1) {
                    block.classList.add('wall');
                } else if (cell === 2) {
                    block.id = 'player';
                    block.classList.add('player');
                    const mouth = document.createElement('div');
                    mouth.classList.add('mouth', 'right');
                    block.appendChild(mouth);
                    playerX = x;
                    playerY = y;
                } else if (cell === 3) {
                    block.classList.add('enemy');
                    enemies.push({ x, y, element: block, direction: randomDirection() });
                } else if (cell === 0) {
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
                    points.push({ x, y });
                    remainingPoints++;
                }

                main.appendChild(block);
            });
        });
    };

    // Handle key up events
    const keyUp = (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                stopMoving();
                break;
            case 'p':
                togglePause();
                break;
        }
    };

    // Handle key down events
    const keyDown = (event) => {
        if (isPaused) return;

        switch (event.key) {
            case 'ArrowUp':
                startMoving('up');
                break;
            case 'ArrowDown':
                startMoving('down');
                break;
            case 'ArrowLeft':
                startMoving('left');
                break;
            case 'ArrowRight':
                startMoving('right');
                break;
        }
    };

    // Configure mute button
    muteButton.innerHTML = '🔊';
    muteButton.style.fontSize = '32px';
    muteButton.style.position = 'fixed';
    muteButton.style.top = '80px';
    muteButton.style.right = '10px';
    muteButton.style.background = 'none';
    muteButton.style.border = 'none';
    muteButton.style.cursor = 'pointer';
    muteButton.style.zIndex = '1000';
    muteButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.innerHTML = isMuted ? '🔇' : '🔊';
        Object.values(sounds).forEach(sound => {
            sound.muted = isMuted;
        });
    });

    // Configure pause button
    pauseButton.innerHTML = '⏸️';
    pauseButton.style.fontSize = '32px';
    pauseButton.style.position = 'fixed';
    pauseButton.style.top = '80px';
    pauseButton.style.right = '80px';
    pauseButton.style.background = 'none';
    pauseButton.style.border = 'none';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.zIndex = '1000';

    // Toggle game pause state
    const togglePause = () => {
        isPaused = !isPaused;
        pauseButton.innerHTML = isPaused ? '▶️' : '⏸️';
    };

    // Check for point collision and update score
    const checkPointCollision = (newX, newY) => {
        const pointIndex = points.findIndex((point) => point.x === newX && point.y === newY);
        if (pointIndex !== -1 && maze[newY][newX] === 0) {
            score += 10;
            remainingPoints--;
            updateScore();
            points.splice(pointIndex, 1);
            sounds.point.play();

            maze[newY][newX] = -1;

            if (remainingPoints === 0) {
                advanceToNextLevel();
            }
        }
    };

    // Move player in the specified direction
    const movePlayer = (direction) => {
        if (isInvincible) return;
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

        const validMove = maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1;

        if (validMove) {
            if (maze[newY][newX] !== 3) {
                checkPointCollision(newX, newY);

                maze[playerY][playerX] = -1;
                playerX = newX;
                playerY = newY;
                maze[newY][newX] = 2;

                renderMaze();
                updateMouthDirection(direction);
            } else {
                handleDeath();
            }
        }
    };

    // Update player's mouth direction
    const updateMouthDirection = (direction) => {
        const playerElement = document.getElementById('player');
        const mouth = playerElement.querySelector('.mouth');

        mouth.classList.remove('up', 'down', 'left', 'right');
        mouth.classList.add(direction);
    };

    // Update mouth direction on key press
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                updateMouthDirection('up');
                break;
            case 'ArrowDown':
                updateMouthDirection('down');
                break;
            case 'ArrowLeft':
                updateMouthDirection('left');
                break;
            case 'ArrowRight':
                updateMouthDirection('right');
                break;
        }
    });

    // Update score display
    const updateScore = () => {
        scoreElement.textContent = score;
    };

    // Update lives display
    const updateLives = () => {
        livesElement.innerHTML = '';

        for (let i = 0; i < lives; i++) {
            const life = document.createElement('li');
            life.textContent = '❤️';
            livesElement.appendChild(life);
        }
    };

    // Handle player death
    const handleDeath = () => {
        if (isInvincible) return;

        lives--;
        updateLives();
        sounds.death.play();

        const playerElement = document.getElementById('player');
        isInvincible = true;

        if (lives === 0) {
            playerElement.classList.add('dead');
            setTimeout(() => {
                gameOver();
            }, 1500);
        } else {
            playerElement.classList.add('hit');
            setTimeout(() => {
                playerElement.classList.remove('hit');
                resetPlayerPosition();
                setTimeout(() => {
                    isInvincible = false;
                }, 500);
            }, 1500);
        }
    };

    // Reset player position to the initial position
    const resetPlayerPosition = () => {
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 2) {
                    playerX = x;
                    playerY = y;
                }
            }
        }
        renderMaze();
    };

    // Update level display
    const levelDisplay = document.querySelector('.level p');

    function updateLevelDisplay() {
        currentLevel++;
        levelDisplay.textContent = currentLevel;
    }

    // Handle game over state
    const gameOver = () => {
        gameStarted = false;
        // Stop all sounds
        Object.values(sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        promptForNameAndSave(score);
        main.innerHTML = '<h2 id="gameOverMessage">Game Over !!</h2>';
        const gameOverMessage = document.getElementById('gameOverMessage');
        gameOverMessage.style.color = '#FF0000';
        gameOverMessage.style.fontSize = '48px';
        gameOverMessage.style.textAlign = 'center';
        gameOverMessage.style.top = '55%';
        gameOverMessage.style.left = '50%';
        gameOverMessage.style.position = 'fixed';
        gameOverMessage.style.transform = 'translate(-50%, -50%)';
        restartButton.style.display = 'block';
    };

    // Configure skip level button
    skipButton.innerHTML = '⏩';
    skipButton.style.fontSize = '32px';
    skipButton.style.position = 'fixed';
    skipButton.style.top = '150px';
    skipButton.style.right = '10px';
    skipButton.style.background = 'none';
    skipButton.style.border = 'none';
    skipButton.style.cursor = 'pointer';
    skipButton.style.zIndex = '1000';
    skipButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';

    // Advance to the next level
    const advanceToNextLevel = () => {
        updateLevelDisplay();
        level++;
        sounds.intermission.play();
        maze = generateMaze(level);
        resetPlayerPosition();
        renderMaze();
        clearInterval(enemyInterval);
        enemyInterval = setInterval(moveEnemies, delays.enemyMove);
    };

    // Start the game
    const startGame = () => {
        maze = generateMaze(level);
        renderMaze();
        score = 0;
        lives = 3;
        updateScore();
        updateLives();
        sounds.beginning.play();
        startDiv.style.display = 'none';
        gameStarted = true;
    };

    // Configure restart button
    restartButton.innerHTML = '🔄';
    restartButton.style.fontSize = '32px';
    restartButton.style.position = 'fixed';
    restartButton.style.top = '150px';
    restartButton.style.right = '80px';
    restartButton.style.background = 'none';
    restartButton.style.border = 'none';
    restartButton.style.cursor = 'pointer';
    restartButton.style.zIndex = '1000';
    restartButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';

    const restartGame = () => {
        startDiv.style.display = 'block';
        restartButton.style.display = 'none';
        location.reload();
    };

    // Function to generate a random direction for enemies
    const randomDirection = () => {
        return Math.floor(Math.random() * 4) + 1;
    };

    // Collision detection with walls for enemies
    function checkWallCollisionForEnemy(enemy) {
        const enemyRect = enemy.getBoundingClientRect();
        const walls = document.getElementsByClassName("wall");

    for (let wall of walls) {
            const wallRect = wall.getBoundingClientRect();

            if (
                enemyRect.top < wallRect.bottom &&
                enemyRect.bottom > wallRect.top &&
                enemyRect.left < wallRect.right &&
                enemyRect.right > wallRect.left
            ) {
                // Collision detected with wall
                return true;
            }
        }

        // No collision with walls
        return false;
    }

    // Function to move the enemies

    function moveEnemies() {
        if (gameStarted && isMoving && !isPaused) {
            const enemies = document.getElementsByClassName("enemy");

            for (let enemy of enemies) {
                let enemyTop = parseInt(enemy.style.top) || 0;
                let enemyLeft = parseInt(enemy.style.left) || 0;
                let direction = enemy.direction || randomDirection();

                if (direction === 1) { // MOVE DOWN
                    enemy.style.top = enemyTop + 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.top = enemyTop + "px";
                        direction = randomDirection();
                    }
                }

                if (direction === 2) { // MOVE UP
                    enemy.style.top = enemyTop - 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.top = enemyTop + "px";
                        direction = randomDirection();
                    }
                }

                if (direction === 3) { // MOVE LEFT
                    enemy.style.left = enemyLeft - 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.left = enemyLeft + "px";
                        direction = randomDirection();
                    }
                }

                if (direction === 4) { // MOVE RIGHT
                    enemy.style.left = enemyLeft + 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.left = enemyLeft + "px";
                        direction = randomDirection();
                    }
                }

                enemy.direction = direction;

                // Check for player collision
                const playerElement = document.getElementById('player');
                const playerRect = playerElement.getBoundingClientRect();
                const enemyRect = enemy.getBoundingClientRect();

                if (
                    enemyRect.top < playerRect.bottom &&
                    enemyRect.bottom > playerRect.top &&
                    enemyRect.left < playerRect.right &&
                    enemyRect.right > playerRect.left
                ) {
                    handleDeath();
                }
            }
        }
    }

    // Periodically call moveEnemies to update enemy positions
    setTimeout(() => {
        setInterval(moveEnemies, 100);
    }, 5500);

    // Event listeners for game controls
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    pauseButton.addEventListener('click', togglePause);
    skipButton.addEventListener('click', advanceToNextLevel);
    clearLeaderboardButton.addEventListener('click', clearLeaderboard);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);

    // Event listeners for on-screen buttons
    // Function to handle mouse down event for the left button
    function onLeftButtonMouseDown() {
        startMoving('left');
    }

    // Function to handle mouse down event for the up button
    function onUpButtonMouseDown() {
        startMoving('up');
    }

    // Function to handle mouse up event for the up button
    function onUpButtonMouseUp() {
        stopMoving();
    }

    // Function to handle mouse down event for the right button
    function onRightButtonMouseDown() {
        startMoving('right');
    }

    // Function to handle mouse up event for the right button
    function onRightButtonMouseUp() {
        stopMoving();
    }

    // Function to handle mouse down event for the down button
    function onDownButtonMouseDown() {
        startMoving('down');
    }

    // Function to handle mouse up event for the down button
    function onDownButtonMouseUp() {
        stopMoving();
    }

    // Attach event listeners to the respective buttons
    document.getElementById('lbttn').addEventListener('mousedown', onLeftButtonMouseDown);
    document.getElementById('ubttn').addEventListener('mousedown', onUpButtonMouseDown);
    document.getElementById('ubttn').addEventListener('mouseup', onUpButtonMouseUp);
    document.getElementById('rbttn').addEventListener('mousedown', onRightButtonMouseDown);
    document.getElementById('rbttn').addEventListener('mouseup', onRightButtonMouseUp);
    document.getElementById('dbttn').addEventListener('mousedown', onDownButtonMouseDown);
    document.getElementById('dbttn').addEventListener('mouseup', onDownButtonMouseUp);

    // Variables for movement control
    let moveInterval = null;
    let currentDirection = null;

    // Function to start moving the player in a specified direction
    const startMoving = (direction) => {
        if (moveInterval) clearInterval(moveInterval);
        currentDirection = direction;
        moveInterval = setInterval(() => movePlayer(direction), delays.playerMove);
    };

    // Function to stop moving the player
    const stopMoving = () => {
        if (moveInterval) clearInterval(moveInterval);
        moveInterval = null;
        currentDirection = null;
    };

    // Initialize the game
    const initializeGame = () => {
        // Add any initialization logic here if needed
    };

    initializeGame();
});
=======
document.addEventListener('DOMContentLoaded', () => {
    const startDiv = document.querySelector('.startDiv');
    const startButton = document.querySelector('.start');
    const main = document.querySelector('main');
    const scoreElement = document.querySelector('.score p');
    const livesElement = document.querySelector('.lives ul');
    const skipButton = document.querySelector('.skipLevel');
    const pauseButton = document.querySelector('.pause');
    const restartButton = document.querySelector('.restart');
    const leaderboardContainer = document.querySelector('.leaderboard');
    const leaderboardList = document.querySelector('.leaderboard ul');
    const clearLeaderboardButton = document.querySelector('.clear-leaderboard');
    const muteButton = document.querySelector('.mute');


    let upPressed = false,
        downPressed = false,
        leftPressed = false,
        rightPressed = false,
        isPaused = false,
        isMuted = false;

    let playerX, playerY,
        score = 0,
        lives = 3,
        enemies = [],
        remainingPoints = 0,
        originalMaze,
        points = [],
        maze,
        level = 1,
        enemyInterval;

    const sounds = {
        beginning: new Audio('as2_pacman_beginning.mp3'),
        death: new Audio('as2_pacman_death.mp3'),
        intermission: new Audio('as2_pacman_intermission.mp3'),
        point: new Audio('as2_Coin_collection.mp3')
    };

    const delays = {
        enemyMove: 1500,
        playerMove: 100
    };

    const mazeLevels = {
        1: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        2: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 1, 3, 0, 0, 0, 3, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 3, 1, 0, 0, 0, 3, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        3: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
            [1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 3, 1, 0, 3, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        4: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 0, 0, 0, 0, 3, 1],
            [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 3, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 3, 1, 0, 0, 0, 0, 3, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
    };

    const generateMaze = (currentLevel) => {
        const maze = mazeLevels[currentLevel] || mazeLevels[1];
        originalMaze = JSON.parse(JSON.stringify(maze)); // Create a deep copy
        return maze;
    };


    
    function checkWallCollisionForEnemy(enemy) {
        const enemyRect = enemy.getBoundingClientRect();
        const walls = document.querySelectorAll(".wall");

        for (let wall of walls) {
            const wallRect = wall.getBoundingClientRect();

            if (
                enemyRect.top < wallRect.bottom &&
                enemyRect.bottom > wallRect.top &&
                enemyRect.left < wallRect.right &&
                enemyRect.right > wallRect.left
            ) {
                // Collision detected with wall
                return true;
            }
        }

        // No collision with walls
        return false;
    }

    const startEnemyMovement = () => {
        if (gameStarted && !isPaused) {
            enemyInterval = setInterval(moveEnemies, 100);
        }
    };

    const stopEnemyMovement = () => {
        clearInterval(enemyInterval);
    };
    function moveEnemies() {
        if (gameStarted && !isPaused) { 
                        enemies = document.querySelectorAll(".enemy");

            for (let enemy of enemies) {
                let enemyTop = parseInt(enemy.style.top) || 0;
                let enemyLeft = parseInt(enemy.style.left) || 0;
                let direction = enemy.direction || randomNumber();

                if (direction === 1) {
                    // MOVE DOWN
                    enemy.style.top = enemyTop + 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.top = enemyTop + "px";
                        direction = randomNumber();
                    }
                }

                if (direction === 2) {
                    // MOVE UP
                    enemy.style.top = enemyTop - 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.top = enemyTop + "px";
                        direction = randomNumber();
                    }
                }

                if (direction === 3) {
                    // MOVE LEFT
                    enemy.style.left = enemyLeft - 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.left = enemyLeft + "px";
                        direction = randomNumber();
                    }
                }

                if (direction === 4) {
                    // MOVE RIGHT
                    enemy.style.left = enemyLeft + 12 + "px";
                    if (checkWallCollisionForEnemy(enemy)) {
                        enemy.style.left = enemyLeft + "px";
                        direction = randomNumber();
                    }
                }

                enemy.direction = direction;
            }
        }
    }


    const showLeaderboard = () => {
        leaderboardContainer.style.display = 'block';
        leaderboardContainer.style.marginTop = '0px';
        leaderboardList.style.listStyleType = 'none';
        leaderboardList.style.paddingLeft = '0';
        leaderboardList.style.marginTop = '10px';
        const leaderboard = getLeaderboard();
        leaderboardList.innerHTML = leaderboard
            .map((entry, index) => `<li style="margin-bottom: 10px;">${index + 1}. ${entry.name} - ${entry.score}</li>`)
            .join('');
    };

    const getLeaderboard = () => JSON.parse(localStorage.getItem('leaderboard') || '[]');

    const saveLeaderboard = (leaderboard) => {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    };

    const addToLeaderboard = (name, score) => {
        const leaderboard = [...getLeaderboard(), { name, score }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        saveLeaderboard(leaderboard);
        showLeaderboard();
    };

    const promptForNameAndSave = (score) => {
        const playerName = prompt('Enter your name:', 'Player');
        if (playerName) addToLeaderboard(playerName, score);
    };

    const clearLeaderboard = () => {
        localStorage.removeItem('leaderboard');
        showLeaderboard();
    };

    const renderMaze = () => {
        main.innerHTML = '';
        enemies = [];
        remainingPoints = 0;
        points = [];

        maze.forEach((row, y) => {
            row.forEach((cell, x) => {
                const block = document.createElement('div');
                block.classList.add('block');

                if (cell === 1) {
                    block.classList.add('wall');
                } else if (cell === 2) {
                    block.id = 'player';
                    block.classList.add('player');
                    const mouth = document.createElement('div');
                    mouth.classList.add('mouth', 'right');
                    block.appendChild(mouth);
                    playerX = x;
                    playerY = y;
                } else if (cell === 3) {
                    block.classList.add('enemy');
                    enemies.push({ x, y, originalCell: originalMaze[y][x] });
                } else if (cell === 0) {
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
                    points.push({ x, y });
                    remainingPoints++;
                }

                main.appendChild(block);
            });
        });
    };

    const keyUp = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                upPressed = false;
                break;
            case 'ArrowDown':
                downPressed = false;
                break;
            case 'ArrowLeft':
                leftPressed = false;
                break;
            case 'ArrowRight':
                rightPressed = false;
                break;
            case 'p':
                togglePause();
                break;
        }
    };

    const keyDown = (event) => {
        if (isPaused) return;

        switch (event.key) {
            case 'ArrowUp':
                upPressed = true;
                movePlayer('up');
                break;
            case 'ArrowDown':
                downPressed = true;
                movePlayer('down');
                break;
            case 'ArrowLeft':
                leftPressed = true;
                movePlayer('left');
                break;
            case 'ArrowRight':
                rightPressed = true;
                movePlayer('right');
                break;
        }
    };

    muteButton.innerHTML = '🔊';
    muteButton.style.fontSize = '32px';
    muteButton.style.position = 'fixed';
    muteButton.style.top = '80px';
    muteButton.style.right = '10px';
    muteButton.style.background = 'none';
    muteButton.style.border = 'none';
    muteButton.style.cursor = 'pointer';
    muteButton.style.zIndex = '1000';
    muteButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.innerHTML = isMuted ? '🔇' : '🔊';
        Object.values(sounds).forEach(sound => {
            sound.muted = isMuted;
        });
    });

    pauseButton.innerHTML = '⏸️';
    pauseButton.style.fontSize = '32px';
    pauseButton.style.position = 'fixed';
    pauseButton.style.top = '80px';
    pauseButton.style.right = '80px';
    pauseButton.style.background = 'none';
    pauseButton.style.border = 'none';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.zIndex = '1000';
    pauseButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';

    const togglePause = () => {
        isPaused = !isPaused;
        if (isPaused) {
            stopEnemyMovement();
            pauseButton.innerHTML = '▶️'; // Resume icon
        } else {
            startEnemyMovement();
            pauseButton.innerHTML = '⏸️'; // Pause icon
        }
    };

    const handleHit = () => {
        const playerElement = document.getElementById('player');
        playerElement.classList.add('hit');
        setTimeout(() => {
            playerElement.classList.remove('hit');
        }, 1500);
    };

    const checkPointCollision = (newX, newY) => {
        const pointIndex = points.findIndex((point) => point.x === newX && point.y === newY);
        if (pointIndex !== -1 && maze[newY][newX] === 0) {
            score += 10;
            remainingPoints--;
            updateScore();
            points.splice(pointIndex, 1);
            sounds.point.play();

            maze[newY][newX] = -1;

            if (remainingPoints === 0) {
                advanceToNextLevel();
            }
        }
    };

    const movePlayer = (direction) => {
        if (isInvincible) return;
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

        const validMove = maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1;

        if (validMove) {
            if (maze[newY][newX] !== 3) {
                checkPointCollision(newX, newY);

                maze[playerY][playerX] = -1;
                playerX = newX;
                playerY = newY;
                maze[newY][newX] = 2;

                renderMaze();
                updateMouthDirection(direction);
            } else {
                handleDeath();
            }
        }
    };

    const updateMouthDirection = (direction) => {
        const playerElement = document.getElementById('player');
        const mouth = playerElement.querySelector('.mouth');

        mouth.classList.remove('up', 'down', 'left', 'right');
        mouth.classList.add(direction);
    };

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                updateMouthDirection('up');
                break;
            case 'ArrowDown':
                updateMouthDirection('down');
                break;
            case 'ArrowLeft':
                updateMouthDirection('left');
                break;
            case 'ArrowRight':
                updateMouthDirection('right');
                break;
        }
    });

    const updateScore = () => {
        scoreElement.textContent = score;
    };

    const updateLives = () => {
        livesElement.innerHTML = ''; // Clear previous lives

        for (let i = 0; i < lives; i++) {
            const life = document.createElement('li');
            life.textContent = '❤️';
            livesElement.appendChild(life);
        }
    };
    let isInvincible = false;

    const handleDeath = () => {
        if (isInvincible) return;

        lives--;
        updateLives();
        sounds.death.play();

        const playerElement = document.getElementById('player');
        isInvincible = true;

        if (lives === 0) {
            playerElement.classList.add('dead');
            setTimeout(() => {
                gameOver();
            }, 1500);
        } else {
            playerElement.classList.add('hit');
            setTimeout(() => {
                playerElement.classList.remove('hit');
                resetPlayerPosition();
                setTimeout(() => {
                    isInvincible = false;
                }, 500); // Additional 0.5 seconds of invincibility after animation
            }, 1500);
        }
    };


    const resetPlayerPosition = () => {
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 2) {
                    playerX = x;
                    playerY = y;
                }
            }
        }
        renderMaze();
    };
    let currentLevel = 1;
    const levelDisplay = document.querySelector('.level p');

    function updateLevelDisplay() {
        currentLevel++;
        levelDisplay.textContent = currentLevel;
    }

    const gameOver = () => {
        stopEnemyMovement();
        gameStarted = false;
        promptForNameAndSave(score);
        main.innerHTML = '<h2 id="gameOverMessage">Game Over !!</h2>';
        const gameOverMessage = document.getElementById('gameOverMessage');
        gameOverMessage.style.color = '#FF0000';
        gameOverMessage.style.fontSize = '48px';
        gameOverMessage.style.textShadow = '0 0 5px #FF0000, 0 0 10px #FF0000';
        gameOverMessage.style.textAlign = 'center';
        gameOverMessage.style.top = '55%';
        gameOverMessage.style.left = '50%';
        gameOverMessage.style.position = 'fixed';
        gameOverMessage.style.transform = 'translate(-50%, -50%)';
        restartButton.style.display = 'block';
    };

    skipButton.innerHTML = '⏩'; // Skip level icon
    skipButton.style.fontSize = '32px';
    skipButton.style.position = 'fixed';
    skipButton.style.top = '150px';
    skipButton.style.right = '10px';
    skipButton.style.background = 'none';
    skipButton.style.border = 'none';
    skipButton.style.cursor = 'pointer';
    skipButton.style.zIndex = '1000';
    skipButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';

    const advanceToNextLevel = () => {
        updateLevelDisplay();
        level++;
        sounds.intermission.play();
        originalMaze = JSON.parse(JSON.stringify(maze));
        maze = generateMaze(level);
        resetPlayerPosition();
        renderMaze();
        clearInterval(enemyInterval);
        enemyInterval = setInterval(moveEnemies, delays.enemyMove);
    };


    const startGame = () => {
        maze = generateMaze(level);
        originalMaze = JSON.parse(JSON.stringify(maze));
        renderMaze();
        score = 0;
        lives = 3;
        updateScore();
        updateLives();
        sounds.beginning.play();
        startDiv.style.display = 'none';
        gameStarted = true;
        startEnemyMovement();
    };

    restartButton.innerHTML = '🔄';
    restartButton.style.fontSize = '32px';
    restartButton.style.position = 'fixed';
    restartButton.style.top = '150px';
    restartButton.style.right = '80px';
    restartButton.style.background = 'none';
    restartButton.style.border = 'none';
    restartButton.style.cursor = 'pointer';
    restartButton.style.zIndex = '1000';
    restartButton.style.textShadow =
        '0 0 5px #722f37, ' +
        '0 0 10px #722f37, ' +
        '0 0 15px #722f37, ' +
        '0 0 20px #722f37, ' +
        '0 0 25px #722f37, ' +
        '0 0 30px #722f37, ' +
        '0 0 35px #722f37';
    const restartGame = () => {
        startDiv.style.display = 'block';
        restartButton.style.display = 'none';
        location.reload();
    };

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    pauseButton.addEventListener('click', togglePause);
    skipButton.addEventListener('click', advanceToNextLevel);
    clearLeaderboardButton.addEventListener('click', clearLeaderboard);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);

    document.getElementById('lbttn').addEventListener('mousedown', () => { movePlayer('left'); leftPressed = true; });
    document.getElementById('lbttn').addEventListener('mouseup', () => { leftPressed = false; });
    document.getElementById('ubttn').addEventListener('mousedown', () => { movePlayer('up'); upPressed = true; });
    document.getElementById('ubttn').addEventListener('mouseup', () => { upPressed = false; });
    document.getElementById('rbttn').addEventListener('mousedown', () => { movePlayer('right'); rightPressed = true; });
    document.getElementById('rbttn').addEventListener('mouseup', () => { rightPressed = false; });
    document.getElementById('dbttn').addEventListener('mousedown', () => { movePlayer('down'); downPressed = true; });
    document.getElementById('dbttn').addEventListener('mouseup', () => { downPressed = false; });
});
>>>>>>> d540ae66dc67c19f68152b2e3659e83ff352eea3
