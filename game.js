const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const platformWidth = 65;
const platformHeight = 20;
const gravity = 0.33;
const bounceVelocity = -12.5;

let platforms = [{ x: canvas.width / 2 - platformWidth / 2, y: canvas.height - 50 }];
let doodle = { width: 40, height: 60, x: canvas.width / 2 - 20, y: canvas.height - 110, dx: 0, dy: 0 };

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function resetGame() {
  platforms = [{ x: canvas.width / 2 - platformWidth / 2, y: canvas.height - 50 }];
  doodle = { width: 40, height: 60, x: canvas.width / 2 - 20, y: canvas.height - 110, dx: 0, dy: 0 };
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  if (doodle.y > canvas.height) {
    resetGame();
    return;
  }

  doodle.dy += gravity;

  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(platform => platform.y += -doodle.dy);

    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(15, 20))
      });
    }
  } else {
    doodle.y += doodle.dy;
  }

  doodle.x += doodle.dx;

  if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
  else if (doodle.x > canvas.width) doodle.x = -doodle.width;

  context.fillStyle = 'green';
  platforms.forEach(platform => {
    context.fillRect(platform.x, platform.y, platformWidth, platformHeight);

    if (doodle.dy > 0 && doodle.y + doodle.height <= platform.y &&
        doodle.x < platform.x + platformWidth && doodle.x + doodle.width > platform.x &&
        doodle.y < platform.y + platformHeight && doodle.y + doodle.height > platform.y) {
      doodle.y = platform.y - doodle.height;
      doodle.dy = bounceVelocity;
    }
  });

  context.fillStyle = 'yellow';
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

}

document.addEventListener('keydown', e => {
  if (e.which === 37) doodle.dx = -3;
  else if (e.which === 39) doodle.dx = 3;
});

document.addEventListener('keyup', () => doodle.dx = 0);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(loop);
