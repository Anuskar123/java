document.addEventListener('DOMContentLoaded', () => {

  const startDiv = document.querySelector('.startDiv');
  const startButton = document.querySelector('.start');
  const main = document.querySelector('main');
  const scoreElement = document.querySelector('.score p');
  const livesElement = document.querySelector('.lives ul');
  const skipButton = document.querySelector('.skipLevel');
  const pauseButton = document.querySelector('.pause');
  const restartButton = document.querySelector('.restart');




  let upPressed = false,
    downPressed = false,
    leftPressed = false,
    rightPressed = false,
    isPaused = false;


  let playerX, playerY,
    score = 0,
    lives = 3,
    enemies = [],
    remainingPoints = 0,
    points = [],
    maze,
    level = 1,
    enemyInterval;


  const beginningSound = new Audio('as2_pacman_beginning.mp3');
  const deathSound = new Audio('as2_pacman_death.mp3');
  const intermissionSound = new Audio('as2_pacman_intermission.mp3');
  const pointSound = new Audio('as2_Coin_collection.mp3');


  const enemyMoveDelay = 1500;
  const playerMoveDelay = 100;

  const generateMaze = (currentLevel) => {
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
    return mazeLevels[currentLevel] || mazeLevels[1];
  };

 






  const leaderboardContainer = document.querySelector('.leaderboard');
  const leaderboardList = document.querySelector('.leaderboard ul');
  const clearLeaderboardButton = document.querySelector('.clear-leaderboard');
  const maxLeaderboardEntries = 10;

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
      .slice(0, maxLeaderboardEntries);
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
          enemies.push({ x, y });
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


  const muteButton = document.querySelector('.mute');
  let isMuted = false;
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
    const sounds = [beginningSound, deathSound, intermissionSound, pointSound];
    sounds.forEach(sound => {
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
      clearInterval(enemyInterval);
      pauseButton.innerHTML = '▶️'; // Resume icon
    } else {
      enemyInterval = setInterval(moveEnemies, enemyMoveDelay);
      pauseButton.innerHTML = '⏸️'; // Pause icon
    }
  };
  function checkEnemyCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll(".enemy");

    for (let enemy of enemies) {
      const enemyRect = enemy.getBoundingClientRect();

      if (
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top &&
        playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left
      ) {
        if (!gameOverState && !collisionCooldown) {
          EnemyHit();
          lives--;

          collisionCooldown = true;
          clearInterval(collisionInterval);
          collisionInterval = setInterval(checkEnemyCollision, 1500);

          setTimeout(() => {
            collisionCooldown = false;
            clearInterval(collisionInterval);
            collisionInterval = setInterval(checkEnemyCollision, 100);
          }, 1500);

          if (lives == 0) {
            gameOverState = true;
            gameOver();
          }
        }
      }
    }
  }

  setInterval(checkEnemyCollision, 100);






  const checkPointCollision = (newX, newY) => {
    const pointIndex = points.findIndex((point) => point.x === newX && point.y === newY);
    if (pointIndex !== -1 && maze[newY][newX] === 0) {
      score += 10;
      remainingPoints--;
      updateScore();
      points.splice(pointIndex, 1);
      pointSound.play();

      maze[newY][newX] = -1;

      if (remainingPoints === 0) {
        advanceToNextLevel();
      }
    }
  };




  const movePlayer = (direction) => {
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


  


  const handleDeath = () => {
    lives--;
    updateLives();
    deathSound.play();

    if (lives === 0) {
      gameOver();
    } else {
      resetPlayerPosition();
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

  const gameOver = () => {
    clearInterval(enemyInterval);
    promptForNameAndSave(score);
    main.innerHTML = '<h2 id = "gameOverMessage">Game Over !!</h2>';
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
    level++;
    intermissionSound.play();
    maze = generateMaze(level);
    resetPlayerPosition();
    currentLevel++;
    renderMaze();
    clearInterval(enemyInterval);
    enemyInterval = setInterval(moveEnemies, enemyMoveDelay);
  };


  let levelDisplay = document.createElement('div');
  levelDisplay.style.fontSize = '24px';
  levelDisplay.style.fontWeight = 'bold';
  levelDisplay.style.margin = '20px';
  levelDisplay.textContent = 'Level: 1';





  const startGame = () => {
    maze = generateMaze(level);
    renderMaze();
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    beginningSound.play();
    startDiv.style.display = 'none';
    enemyInterval = setInterval(moveEnemies, enemyMoveDelay);
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
    startGame();
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