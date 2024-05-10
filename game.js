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

  // Проверяем, вышел ли игрок за пределы холста.
  if (doodle.y > canvas.height) {
    // Перезапускаем игру, возвращая игрока в начальную позицию.
    doodle.y = canvas.height - 110;
    doodle.dy = 0;
    platforms = [{
      x: canvas.width / 2 - platformWidth / 2,
      y: canvas.height - 50
    }];
    minPlatformSpace = 15;
    maxPlatformSpace = 20;
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
