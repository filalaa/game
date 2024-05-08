const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const platformWidth = 65;
const platformHeight = 20;
const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

let platforms = [];
let doodle = {};

function initialize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  doodle = {
    width: 40,
    height: 60,
    x: canvas.width / 2 - 20,
    y: canvas.height - 110,
    dx: 0,
    dy: 0
  };
  generatePlatforms();
  loop();
}

function generatePlatforms() {
  let y = canvas.height - 50;
  while (y > 0) {
    y -= platformHeight + Math.random() * 20 + 15;
    let x;
    do {
      x = Math.random() * (canvas.width - platformWidth - 50) + 25;
    } while (
      y > canvas.height / 2 &&
      x > canvas.width / 2 - platformWidth * 1.5 &&
      x < canvas.width / 2 + platformWidth / 2
    );
    platforms.push({ x, y });
  }
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  doodle.dy += gravity;
  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(platform => platform.y -= doodle.dy);
    while (platforms[platforms.length - 1].y > 0) {
      const x = Math.random() * (canvas.width - platformWidth - 50) + 25;
      const y = platforms[platforms.length - 1].y - (platformHeight + Math.random() * 20 + 15);
      platforms.push({ x, y });
    }
  } else {
    doodle.y += doodle.dy;
  }

  doodle.dx *= 1 - drag;
  doodle.x += doodle.dx;
  if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
  else if (doodle.x > canvas.width) doodle.x = -doodle.width;

  platforms.forEach(platform => {
    context.fillRect(platform.x, platform.y, platformWidth, platformHeight);
    if (
      doodle.dy > 0 &&
      doodle.y + doodle.height <= platform.y &&
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
}

document.addEventListener('keydown', function(e) {
  if (e.which === 37) {
    doodle.dx = -3;
  } else if (e.which === 39) {
    doodle.dx = 3;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.which === 37 || e.which === 39) {
    doodle.dx = 0;
  }
});

canvas.addEventListener('touchstart', function(e) {
  const touchX = e.touches[0].clientX;
  const canvasCenter = canvas.getBoundingClientRect().left + canvas.width / 2;

  if (touchX < canvasCenter) {
    doodle.dx = -3;
  } else {
    doodle.dx = 3;
  }
});

canvas.addEventListener('touchend', function(e) {
  doodle.dx = 0;
});

window.addEventListener('resize', initialize);

initialize();
