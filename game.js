const canvas = document.getElementById('game');
// Получаем элемент canvas по его идентификатору 'game'.

const context = canvas.getContext('2d');
// Получаем контекст отрисовки для элемента canvas.

const playerImg = document.getElementById('playerImg');
// Получаем изображение игрока по его идентификатору 'playerImg'.

// Ширина и высота каждой платформы и начальные координаты платформ.
const platformWidth = 65;
const platformHeight = 20;

// Физика игрока.
const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

// Минимальное и максимальное вертикальное расстояние между каждой платформой.
let minPlatformSpace = 15;
let maxPlatformSpace = 20;

// Информация о каждой платформе. Первая платформа начинается внизу посередине экрана.
let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: canvas.height - 50
}];

// Получить случайное число между минимальным (включительно) и максимальным (исключительно).
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Заполнить начальный экран платформами.
let y = canvas.height - 50;
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

// Игрок.
const doodle = {
  width: 40,
  height: 60,
  x: canvas.width / 2 - 20,
  y: canvas.height - 110,

  // Скорость.
  dx: 0,
  dy: 0
};

// Отслеживаем направление и действия игрока.
let playerDir = 0;
let playerDirAngle = 0;
let keydown = false;
let prevDoodleY = doodle.y;

// Игровой цикл.
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // Применяем гравитацию к игроку.
  doodle.dy += gravity;

  // Если игрок достигает середины экрана, двигаем платформы вниз, чтобы создать иллюзию подъема.
  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(function(platform) {
      platform.y += -doodle.dy;
    });

    // Добавляем больше платформ сверху экрана по мере подъема игрока.
    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      })
      minPlatformSpace += 0.5;
      maxPlatformSpace += 0.5;
      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  }
  else {
    doodle.y += doodle.dy;
  }

  // Применяем сопротивление горизонтальному движению только если клавиша не нажата.
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

  // Рисуем платформы.
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

  // Рисуем игрока.
  context.fillStyle = 'yellow';
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

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

  // Удаляем платформы, вышедшие за пределы экрана.
  platforms = platforms.filter(function(platform) {
    return platform.y < canvas.height;
  })
}

// Слушаем события клавиатуры для управления игроком.
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

// Слушаем события касания для управления игроком на мобильных устройствах.
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

// Устанавливаем размеры canvas на основе размера экрана устройства.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Изменяем размер canvas при изменении размера окна.
window.addEventListener('resize', resizeCanvas);

// Изначально устанавливаем размер canvas.
resizeCanvas();

// Запускаем игру.
requestAnimationFrame(loop);
