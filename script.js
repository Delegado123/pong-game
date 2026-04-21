const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 5;
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let playerScore = 0;
let computerScore = 0;
let gameRunning = false;
let mouseY = canvas.height / 2;
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        toggleGame();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
document.addEventListener('mousemove', (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    mouseY = e.clientY - canvasRect.top;
});
function toggleGame() {
    gameRunning = !gameRunning;
    const statusElement = document.getElementById('gameStatus');
    if (gameRunning) {
        statusElement.textContent = 'Game Running';
    } else {
        statusElement.textContent = 'Paused - Press SPACE to Continue';
    }
}
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballSpeedY = (Math.random() - 0.5) * 8;
}
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(x, y, width, height);
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, width, height);
    ctx.shadowBlur = 0;
}
function drawBall(x, y, radius) {
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#ff6b9d';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}
function updatePlayerPaddle() {
    playerY = mouseY - paddleHeight / 2;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        playerY -= 7;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        playerY += 7;
    }
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) {
        playerY = canvas.height - paddleHeight;
    }
}
function updateComputerPaddle() {
    const computerCenter = computerY + paddleHeight / 2;
    const difficulty = 4;
    const offset = 30;
    if (computerCenter < ballY - offset) {
        computerY += difficulty;
    } else if (computerCenter > ballY + offset) {
        computerY -= difficulty;
    }
    if (computerY < 0) computerY = 0;
    if (computerY + paddleHeight > canvas.height) {
        computerY = canvas.height - paddleHeight;
    }
}
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY *= -1;
        ballY = ballY - ballRadius < 0 ? ballRadius : canvas.height - ballRadius;
    }
    if (ballX - ballRadius < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX *= -1;
        ballX = paddleWidth + ballRadius;
        ballSpeedY += (ballY - (playerY + paddleHeight / 2)) * 0.1;
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > computerY && ballY < computerY + paddleHeight) {
        ballSpeedX *= -1;
        ballX = canvas.width - paddleWidth - ballRadius;
        ballSpeedY += (ballY - (computerY + paddleHeight / 2)) * 0.1;
    }
    if (ballX - ballRadius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
    const maxSpeed = 12;
    if (Math.abs(ballSpeedX) > maxSpeed) {
        ballSpeedX = maxSpeed * Math.sign(ballSpeedX);
    }
    if (Math.abs(ballSpeedY) > maxSpeed) {
        ballSpeedY = maxSpeed * Math.sign(ballSpeedY);
    }
}
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCenterLine();
    drawPaddle(0, playerY, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
    drawBall(ballX, ballY, ballRadius);
}
function gameLoop() {
    if (gameRunning) {
        updatePlayerPaddle();
        updateComputerPaddle();
        updateBall();
    }
    draw();
    requestAnimationFrame(gameLoop);
}
resetBall();
gameLoop();