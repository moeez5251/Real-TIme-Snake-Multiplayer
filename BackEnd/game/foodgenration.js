import { WIDTH, HEIGHT } from "./constants.js";
export function generateFood(snakes) {
  let x, y;
  do {
    x = Math.floor(Math.random() * WIDTH);
    y = Math.floor(Math.random() * HEIGHT);
  } while (snakes.some(s => s.body.some(seg => seg.x === x && seg.y === y)));
  return { x, y };
}