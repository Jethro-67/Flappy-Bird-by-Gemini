const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const hint = document.querySelector('.hint');

const width = canvas.width;
const height = canvas.height;

const bird = {
    x: 80,
    y: height / 2,
    radius: 7,
    velocity: 0,
    gravity: 0.45,
    lift: -9,
    color: '#ffdd57'
};

const pipeWidth = 70;
const pipeGap = 400;
const pipeSpeed = 2.2;
let pipes = [];
let score = 0;
let isRunning = false;
let isGameOver = false;
let frameCount = 0;

function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    isRunning = false;
    isGameOver = false;
    scoreElement.textContent = score;
    hint.textContent = 'Click or press Space to start';
}

function addPipe() {
    const topHeight = Math.random() * (height - pipeGap - 120) + 50;
    pipes.push({ x: width, top: topHeight, bottom: topHeight + pipeGap });
}

function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    ctx.fillStyle = '#22c55e';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, height - pipe.bottom);
    });
}

function drawGround() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, height - 20, width, 20);
}

function drawText() {
    if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, height / 2 - 60, width, 120);
        ctx.fillStyle = '#fff';
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', width / 2, height / 2 - 10);
        ctx.font = '18px Arial';
        ctx.fillText('Click or space to restart', width / 2, height / 2 + 24);
    }
}

function update() {
    if (isRunning && !isGameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        frameCount += 1;

        if (frameCount % 30 === 0) {
            addPipe();
        }

        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;
        });

        if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
            pipes.shift();
        }

        pipes.forEach(pipe => {
            if (!pipe.scored && bird.x > pipe.x + pipeWidth) {
                score += 1;
                pipe.scored = true;
                scoreElement.textContent = score;
            }
        });

        if (bird.y + bird.radius > height - 20 || bird.y - bird.radius < 0) {
            endGame();
        }

        pipes.forEach(pipe => {
            const hitTop = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth && bird.y - bird.radius < pipe.top;
            const hitBottom = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth && bird.y + bird.radius > pipe.bottom;
            if (hitTop || hitBottom) {
                endGame();
            }
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, width, height);
    drawPipes();
    drawGround();
    drawBird();
    drawText();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function flap() {
    if (isGameOver) {
        resetGame();
        return;
    }
    if (!isRunning) {
        isRunning = true;
        hint.textContent = 'Keep flapping!';
    }
    bird.velocity = bird.lift;
}

function endGame() {
    isGameOver = true;
    hint.textContent = 'Game over. Click to restart.';
}

window.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        event.preventDefault();
        flap();
    }
});

canvas.addEventListener('click', flap);

resetGame();
loop();
