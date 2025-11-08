const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🖼️ Load photo
const photo = new Image();
photo.src = "friend.png";

// 🎵 Sounds
const flapSound = new Audio("flap.mp3");
const hitSound = new Audio("hit.mp3");

// ⚙️ Easy Mode Settings
const GRAVITY = 0.16;          // Slow fall
const LIFT = -8.7;             // Long jump
const FLAP_DAMPING = 0.93;
const MAX_FALL_SPEED = 4.6;
const PIPE_SPEED = 1.0;        // Very slow pipe movement
const PIPE_SPAWN_FRAMES = 180; // Pipes appear after longer delay
const PIPE_GAP = 200;          // Large gap (easy to pass)
const PIPE_MIN_HEIGHT = 40;    // Shorter pipes
const PIPE_MAX_HEIGHT = 120;   // Pipes not too tall
const SCORE_INTERVAL = 180;

let bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  velocity: 0
};

let pipes = [];
let score = 0;
let frames = 0;
let gameStarted = false;

// 🐦 Draw photo (bird)
function drawBird() {
  ctx.drawImage(photo, bird.x, bird.y, bird.width, bird.height);
}

// 🌳 Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  }
}

// 🔄 Update pipes
function updatePipes() {
  if (frames % PIPE_SPAWN_FRAMES === 0) {
    let top = Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT;
    let gap = PIPE_GAP;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= PIPE_SPEED;
    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
  }
}

// 💥 Collision detection
function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      hitSound.play();
      resetGame();
    }
  }

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    hitSound.play();
    resetGame();
  }
}

// 🌀 Reset Game
function resetGame() {
  alert("Game Over 😭  Score: " + score);
  document.location.reload();
}

// 🎯 Score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 🔁 Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += GRAVITY;
  bird.velocity *= FLAP_DAMPING;
  if (bird.velocity > MAX_FALL_SPEED) bird.velocity = MAX_FALL_SPEED;
  bird.y += bird.velocity;

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();
  checkCollision();

  frames++;
  if (frames % SCORE_INTERVAL === 0) score++;

  requestAnimationFrame(gameLoop);
}

// 🕹️ Controls
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameLoop();
  }
  bird.velocity = LIFT;
  flapSound.currentTime = 0;
  flapSound.play();
}

document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame);

// 🖼️ Start message
photo.onload = () => {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Tap or press any key to start!", 70, 300);
};
