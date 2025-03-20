const canvas = document.getElementById("stockChart");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gridSize = 50;
let speed = 2;
let x = 0;
let y = canvas.height / 2;
let amplitude = 50;
let prevY = y;
let reachedEnd = true;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function moveStock() {
    x += speed;
    let change = (Math.random() - 0.5) * amplitude;
    prevY = y;
    y = Math.max(50, Math.min(canvas.height - 50, y + change));

    ctx.strokeStyle = y > prevY ? "red" : "green";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x - speed, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (x > canvas.width) {
        reachedEnd = true;
    }
}

function animate() {
    if (reachedEnd) {
        drawGrid();
        reachedEnd = false;
        x = 0;
    }
    moveStock();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid();
});