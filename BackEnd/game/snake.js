import { WIDTH, HEIGHT } from "./constants.js";
import { generateFood } from "./foodGeneration.js";
import { io } from "../server.js";
import { getSafeSnake } from "../utils/rooms.js";

export function createSnake(socketId, name, skin, room) {
  let x, y, attempts = 0;
  const maxAttempts = 50;

  do {
    x = WIDTH/2;
    y = HEIGHT/2;
    attempts++;
  } while (attempts < maxAttempts && room.snakes.some(s => s.body.some(seg => seg.x === x && seg.y === y)));

  if (attempts >= maxAttempts) { x = Math.floor(WIDTH / 2); y = Math.floor(HEIGHT / 2); }

  return {
    id: socketId,
    name: name || "Player",
    skin: skin || { head: "#a8ff78", body: "#78ffd6" },
    direction: "RIGHT",
    boost: false,
    stamina: 100,
    score: 0,
    body: [{ x, y }],
    dead: false
  };
}

export function gameTick(room) {
  if (!room) return;

  let newFood = null;

  room.snakes.forEach(snake => {
    if (snake.dead) return;

    if (!snake.boost) snake.stamina = Math.min(100, snake.stamina + 0.2);
    const head = { ...snake.body[0] };
    const steps = snake.boost && snake.stamina > 0 ? 2 : 1;

    for (let i = 0; i < steps; i++) {
      switch (snake.direction) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) { snake.dead = true; return; }

      if (snake.body.some((seg, idx) => idx > 0 && seg.x === head.x && seg.y === head.y)) { snake.dead = true; return; }

      const hitOther = room.snakes.some(other => other.id !== snake.id && !other.dead && other.body.some(seg => seg.x === head.x && seg.y === head.y));
      if (hitOther) { snake.dead = true; return; }
    }

    snake.body.unshift(head);

    if (head.x === room.food.x && head.y === room.food.y) {
      newFood = generateFood(room.snakes);
      snake.score += 1;
    } else snake.body.pop();

    if (snake.boost) {
      snake.stamina = Math.max(0, snake.stamina - 3);
      if (snake.stamina <= 0) snake.boost = false;
    }
  });

  if (newFood) room.food = newFood;

  io.to(room.id).emit("update", {
    snakes: room.snakes.map(getSafeSnake),
    food: room.food,
    width: WIDTH,
    height: HEIGHT
  });
}
