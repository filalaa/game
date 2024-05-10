const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const playerImg = document.getElementById('playerImg');

const platformWidth = 65;
const platformHeight = 20;

const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

let bestScore = 0;
let score = 0; // Переменная для отслеживания расстояния прыжка.
let jumpStartPosition = 0; // Стартовая позиция игрока для подсчёта прыжка.


let minPlatformSpace = 20;
let maxPlatformSpace = 25;

let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: canvas.height - 50
}];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function start(){
  score = 0;
  jumpStartPosition = doodle.y;
  
  doodle.y = canvas.height - 110;
  doodle.x = canvas.width / 2 - platformWidth / 2;
  doodle.dy = 0;
  platforms = [{
     x: canvas.width / 2 - platformWidth / 2,
     y: canvas.height - 50
  }];

  // Генерируем новые платформы сверху после перезапуска игры.
  let y = platforms[0].y;
  while (y > 0) {
    y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);
    let x;
    do {
      x = random(25, canvas.width - 25 - platformWidth);
    } while (
       y > canvas.height / 2 &&
       x > canvas.width / 2 - platformWidth * 1.5 &&
       x < canvas.width / 2 + platformWidth / 2
    );
    platforms.push({ x, y });
  }

  minPlatformSpace = 15;
  maxPlatformSpace = 20;
}

const doodle = {
  width: 40,
  height: 60,
  x: canvas.width / 2 - 20,
  y: canvas.height - 110,
  dx: 0,
  dy: 0
};

let playerDir = 0;
let playerDirAngle = 0;
let keydown = false;
let prevDoodleY = doodle.y;

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  doodle.dy += gravity;

  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(function(platform) {
      platform.y += -doodle.dy;
      score += doodle.dy;
    });

    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      });
      minPlatformSpace += 0.5;
      maxPlatformSpace += 0.5;
      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  }
  else {
    doodle.y += doodle.dy;
  }

  if (doodle.y > canvas.height) {
    start()
  }


  if (!keydown) {
    if (playerDir < 0) {
      doodle.dx += drag;
      if (doodle.dx > 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
    else if (playerDir > 0) {
      doodle.dx -= drag;
      if (doodle.dx < 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
  }

  doodle.x += doodle.dx;

  if (doodle.x + doodle.width < 0) {
    doodle.x = canvas.width;
  }
  else if (doodle.x > canvas.width) {
    doodle.x = -doodle.width;
  }

  context.fillStyle = 'green';
  platforms.forEach(function(platform) {
    context.fillRect(platform.x, platform.y, platformWidth, platformHeight);
    if (
      doodle.dy > 0 &&
      prevDoodleY + doodle.height <= platform.y &&
      doodle.x < platform.x + platformWidth &&
      doodle.x + doodle.width > platform.x &&
      doodle.y < platform.y + platformHeight &&
      doodle.y + doodle.height > platform.y
    ) {
      doodle.y = platform.y - doodle.height;
      doodle.dy = bounceVelocity;
    }
  });

  context.fillStyle = 'yellow';
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

 
  
  drawScore(-score);

  if (playerDir != 0){
    playerDirAngle = playerDir;
  }
  
  if (playerImg instanceof HTMLImageElement) {
    if (playerDirAngle > 0) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(playerImg, -doodle.x - 80 + 16, doodle.y - 10, 80, 80);
      context.restore();
    } else {
      context.drawImage(playerImg, doodle.x - 16, doodle.y - 10, 80, 80);
    }
    
  } else {
    console.error("playerImg не является HTMLImageElement:", playerImg);
  }

  prevDoodleY = doodle.y;

  platforms = platforms.filter(function(platform) {
    return platform.y < canvas.height;
  })
}

document.addEventListener('keydown', function(e) {
  if (e.which === 37) {
    keydown = true;
    playerDir = -1;
    doodle.dx = -3;

  }
  else if (e.which === 39) {
    keydown = true;
    playerDir = 1;
    doodle.dx = 3;
  }
});

document.addEventListener('keyup', function(e) {
  keydown = false;
});

canvas.addEventListener('touchstart', function(e) {
  const touchX = e.touches[0].clientX;
  const canvasCenter = canvas.getBoundingClientRect().left + canvas.width / 2;

  if (touchX < canvasCenter) {
    keydown = true;
    playerDir = -1;
    doodle.dx = -3;
  } else {
    keydown = true;
    playerDir = 1;
    doodle.dx = 3;
  }
});

canvas.addEventListener('touchend', function(e) {
  keydown = false;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawScore(score) {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'center';

  if(bestScore < score){
    bestScore = score;
  }

    
  context.fillText('Best: ' + Math.floor(bestScore/1000), canvas.width / 2, 30);
  context.fillText('Score: ' + Math.floor(score/1000), canvas.width / 2 + 100, 30);
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
start()
requestAnimationFrame(loop);
