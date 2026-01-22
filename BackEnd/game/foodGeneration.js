import { WIDTH, HEIGHT } from "./constants.js";

export function generateFood(snakes = []) {
  let x, y;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    x = Math.floor(Math.random() * WIDTH);
    y = Math.floor(Math.random() * HEIGHT);
    attempts++;
  } while (
    attempts < maxAttempts &&
    snakes.some(snake => snake.body.some(seg => seg.x === x && seg.y === y))
  );

  return { x, y };
}
