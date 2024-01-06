import "./style.css";

/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const offset = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const point = { x: 90, y: 120 };
const G = { x: 20, y: 50 };
const center = { x: 0, y: 0 };

// Перемещаем систему координат в центре экрана
ctx.translate(offset.x, offset.y);

animate();

// События
canvas.addEventListener("mousemove", (event) => {
  point.x = event.offsetX - offset.x;
  point.y = event.offsetY - offset.y;
});

// Функции
function animate() {
  ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);
  drawCoordinateSystem();

  drawArrow(center, point, "red");
  drawArrow(center, G, "red");

  const resultAdd = add(point, G);
  drawArrow(center, resultAdd, "brown");

  const resultSubtract = subtract(point, G);
  drawArrow(center, resultSubtract, "gray");

  drawArrow(G, point);

  const scaleSubtract = scale(normalize(resultSubtract), 50);
  drawArrow(center, scaleSubtract, "lightgrey");

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.moveTo(G.x, G.y);
  ctx.lineTo(resultAdd.x, resultAdd.y);
  ctx.lineTo(point.x, point.y);
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  requestAnimationFrame(animate);
}

// Скалярное произведение - 0, если векторы перпендикулярны, 1 - если они совпадают, -1 - если противоположно направлены, получить угол можно через Math.acos
function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

function normalize(p) {
  return scale(p, 1 / magnitude(p));
}

function scale(p, scaler) {
  return {
    x: p.x * scaler,
    y: p.y * scaler,
  };
}

function drawArrow(tail, tip, color = "white", size = 20) {
  const { direction } = toPolar(subtract(tip, tail));
  const v1 = { direction: direction + Math.PI * 0.8, magnitude: size / 2 };
  const p1 = toCartesian(v1);

  const t1 = add(p1, tip);

  const v2 = { direction: direction - Math.PI * 0.8, magnitude: size / 2 };
  const p2 = toCartesian(v2);

  const t2 = add(p2, tip);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fill();

  ctx.restore();
}

function subtract(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
}

function add(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}

function toCartesian({ magnitude, direction }) {
  return {
    x: magnitude * Math.cos(direction),
    y: magnitude * Math.sin(direction),
  };
}

function toPolar({ x, y }) {
  return {
    magnitude: magnitude({ x, y }),
    direction: direction({ x, y }),
  };
}

function magnitude({ x, y }) {
  return Math.hypot(x, y);
}

function direction({ x, y }) {
  return Math.atan2(y, x);
}

function drawCoordinateSystem() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-offset.x, 0);
  ctx.lineTo(canvas.width - offset.x, 0);
  ctx.moveTo(0, -offset.y);
  ctx.lineTo(0, canvas.height - offset.y);
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.restore();
}

function drawPoint(loc, size = 10, color = "white") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(loc.x, loc.y, size / 2, 0, 2 * Math.PI);
  ctx.fill();
}
