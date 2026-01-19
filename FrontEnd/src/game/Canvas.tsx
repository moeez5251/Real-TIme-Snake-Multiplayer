import { useEffect, useRef, useState } from "react";
import { GRID_SIZE } from "./constants";
import type { Direction, Segment } from "./components/type";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Segment[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const directionRef = useRef<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const foodRef = useRef<Segment>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);

  const generateFood = (snake: Segment[], canvasWidth: number, canvasHeight: number) => {
    const widthInGrid = Math.ceil(canvasWidth / GRID_SIZE);
    const heightInGrid = Math.ceil(canvasHeight / GRID_SIZE);
    let x, y;
    do {
      x = Math.floor(Math.random() * widthInGrid);
      y = Math.floor(Math.random() * heightInGrid);
    } while (snake.some(seg => seg.x === x && seg.y === y));
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = directionRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && dir !== "DOWN") directionRef.current = "UP";
      if ((e.key === "ArrowDown" || e.key === "s") && dir !== "UP") directionRef.current = "DOWN";
      if ((e.key === "ArrowLeft" || e.key === "a") && dir !== "RIGHT") directionRef.current = "LEFT";
      if ((e.key === "ArrowRight" || e.key === "d") && dir !== "LEFT") directionRef.current = "RIGHT";
    };
    window.addEventListener("keydown", handleKeyDown);

    const TICK_RATE = 120;

    const tick = () => {
      if (gameOver) return;

      const snake = snakeRef.current;
      const head = snake[0];
      const newHead = { ...head };
      const dir = directionRef.current;

      if (dir === "UP") newHead.y -= 1;
      if (dir === "DOWN") newHead.y += 1;
      if (dir === "LEFT") newHead.x -= 1;
      if (dir === "RIGHT") newHead.x += 1;

      const widthInGrid = Math.ceil(canvas.width / GRID_SIZE);
      const heightInGrid = Math.ceil(canvas.height / GRID_SIZE);

      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= widthInGrid ||
        newHead.y >= heightInGrid ||
        snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        snake.unshift(newHead);
        foodRef.current = generateFood(snake, canvas.width, canvas.height);
        setScore(s => s + 1);
      } else {
        snake.unshift(newHead);
        snake.pop();
      }

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0f2027");
      gradient.addColorStop(0.5, "#203a43");
      gradient.addColorStop(1, "#2c5364");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      const visibleX = widthInGrid;
      const visibleY = heightInGrid;
      for (let x = 0; x <= visibleX; x++) {
        for (let y = 0; y <= visibleY; y++) {
          ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }

      // Draw snake
      snake.forEach((segment, index) => {
        const grad = ctx.createLinearGradient(
          segment.x * GRID_SIZE,
          segment.y * GRID_SIZE,
          (segment.x + 1) * GRID_SIZE,
          (segment.y + 1) * GRID_SIZE
        );
        grad.addColorStop(0, index === 0 ? "#a8ff78" : "#78ffd6");
        grad.addColorStop(1, index === 0 ? "#78ffd6" : "#a8ff78");

        ctx.fillStyle = grad;
        ctx.shadowColor = index === 0 ? "#a8ff78" : "#78ffd6";
        ctx.shadowBlur = index === 0 ? 6 : 2;

        ctx.beginPath();
        ctx.roundRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw food as glowing circle
      const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
      const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
      const foodRadius = GRID_SIZE / 2 - 2;
      const foodGrad = ctx.createRadialGradient(foodX, foodY, foodRadius / 4, foodX, foodY, foodRadius);
      foodGrad.addColorStop(0, "#ff8080");
      foodGrad.addColorStop(1, "#ff0000");

      ctx.fillStyle = foodGrad;
      ctx.shadowColor = "#ff4040";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score
      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.fillText(`Score: ${score}`, 20, 30);
    };

    const interval = setInterval(tick, TICK_RATE);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, display: "block" }} />
      {gameOver && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "red",
            fontSize: "48px",
            fontFamily: "monospace",
            flexDirection: "column",
          }}
        >
          <div>GAME OVER</div>
          <div style={{ fontSize: "24px", marginTop: "20px" }}>Score: {score}</div>
        </div>
      )}
    </>
  );
};

export default Canvas;
