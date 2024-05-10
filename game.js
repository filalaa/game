const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const player = { x: canvas.width / 2, y: canvas.height / 2, width: 40, height: 60, dx: 0, dy: 0 };
const gravity = 0.33;
const moveSpeed = 3;
const velocity = 0;
const bounceVelocity = -12.5;
const platforms = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function generatePlatforms() {
  let y = canvas.height - 50;
  while (y > 0) {
    y -= 35 + random(5, 20);
    const x = random(25, canvas.width - 90);
    platforms.push({ x, y });
  }
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.dy += gravity;
  player.dx = velocity * moveSpeed;
  player.x += player.dx;
  player.y += player.dy;

  platforms.forEach(function(platform) {
    if (player.dy > 0 && player.y + player.height >= platform.y && player.y < platform.y + 20 && player.x + player.width > platform.x && player.x < platform.x + 65) {
      player.y = platform.y - player.height;
      player.dy = bounceVelocity;
    }
    context.fillRect(platform.x, platform.y, 65, 20);
  });

  context.fillRect(player.x, player.y, player.width, player.height);
}

document.addEventListener('keydown', function(e) {
  if (e.which === 37) 
    velocity = -1;
  else if (e.which === 39) 
    velocity = 1;
});

document.addEventListener('keyup', function(e) {
    velocity = 0;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
generatePlatforms();
requestAnimationFrame(loop);
