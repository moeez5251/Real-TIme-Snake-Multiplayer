// Canvas.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  MdSportsEsports,
  MdSettings,
  MdVolumeUp,
  MdLeaderboard,
  MdAdd,
  MdRemove,
  MdNearMe,
  MdPerson,
  MdSearch,
} from "react-icons/md";

import type { Direction, Segment, Snake } from "./components/type";

// Patterns (only Solid for now)
interface PatternProps {
  color: string;
  size: number;
}

const SolidPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 20px ${color}80, 0 0 10px ${color}40`,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.15)",
    }}
  />
);

// ── Config ────────────────────────────────────────────────────────────────
const ROOM_ID = "room1";
const DEFAULT_SKIN = {
  head: "#0ddff2",
  body: "#00f2ff",
  pattern: "solid" as const, // later: stripes | dots | glow
};

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [gameState, setGameState] = useState<{ snakes: Snake[]; food: Segment; myId: string; width: number; height: number } | null>(null);
  const [mySnake, setMySnake] = useState<Snake | null>(null);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gridSize, setGridSize] = useState(28);

  const directionRef = useRef<Direction>("RIGHT");
  const boostRef = useRef(false);

  // Simple skin customization (for now client-side preview — later send to server)
  const [customSkin, setCustomSkin] = useState(DEFAULT_SKIN);

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", {
        rId: ROOM_ID,
        name: "Moeez",
        skin: customSkin,
      });
    });

    socket.on("init", (data) => {
      setGameState(data);
      const me = data.snakes.find((s: Snake) => s.id === data.myId);
      if (me) {
        setMySnake(me);
        setScore(me.score ?? 0);
        setLength(me.body.length);
      }
      setGameOver(false);
    });

    socket.on("update", (data: { snakes: Snake[]; food: Segment }) => {
      setGameState(prev => prev ? { ...prev, snakes: data.snakes, food: data.food } : null);

      const me = data.snakes.find((s: Snake) => s.id === gameState?.myId);
      if (me) {
        setMySnake(me);
        setScore(me.score ?? 0);
        setLength(me.body.length);
        if (me.dead) setGameOver(true);
      } else if (gameState?.myId && !data.snakes.some(s => s.id === gameState.myId)) {
        setGameOver(true);
      }
    });

    return () => socket.disconnect();
  }, []);

  // ── Keyboard Controls ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      e.preventDefault();

      let newDir: Direction | null = null;
      switch (e.key.toLowerCase()) {
        case "w": case "arrowup":    newDir = "UP"; break;
        case "s": case "arrowdown":  newDir = "DOWN"; break;
        case "a": case "arrowleft":  newDir = "LEFT"; break;
        case "d": case "arrowright": newDir = "RIGHT"; break;
        case " ":
          if (!boostRef.current) {
            boostRef.current = true;
            socketRef.current?.emit("boost", true);
          }
          return;
      }
      if (newDir && newDir !== directionRef.current) {
        directionRef.current = newDir;
        socketRef.current?.emit("directionChange", newDir);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        boostRef.current = false;
        socketRef.current?.emit("boost", false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver]);

  // ── Responsive Grid ───────────────────────────────────────────────────────
  const updateGrid = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !gameState) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const gameW = gameState.width * 28;
    const gameH = gameState.height * 28;
    const scale = Math.min(c.width / gameW, c.height / gameH) * 0.98;
    setGridSize(Math.max(16, Math.round(28 * scale)));
  }, [gameState]);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  // ── Canvas Render (smooth movement) ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;
    const smoothFactor = 0.18; // interpolation speed

    const draw = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      ctx.fillStyle = "#0a0f10";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cell = gridSize;
      const gameW = gameState.width * cell;
      const gameH = gameState.height * cell;
      const ox = (canvas.width - gameW) / 2;
      const oy = (canvas.height - gameH) / 2;

      // Grid background
      ctx.strokeStyle = "rgba(13,223,242,0.07)";
      for (let x = 0; x <= gameState.width; x++) {
        ctx.beginPath();
        ctx.moveTo(ox + x * cell, oy);
        ctx.lineTo(ox + x * cell, oy + gameH);
        ctx.stroke();
      }
      for (let y = 0; y <= gameState.height; y++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + y * cell);
        ctx.lineTo(ox + gameW, oy + y * cell);
        ctx.stroke();
      }

      // Food
      if (gameState.food) {
        const fx = ox + gameState.food.x * cell + cell / 2;
        const fy = oy + gameState.food.y * cell + cell / 2;
        ctx.shadowColor = "#0ddff2";
        ctx.shadowBlur = 25;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(fx, fy, cell * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Snakes with smooth interpolation
      gameState.snakes.forEach(snake => {
        ctx.save();
        snake.body.forEach((seg, i) => {
          const x = ox + seg.x * cell;
          const y = oy + seg.y * cell;
          const isHead = i === 0;

          const size = cell * (isHead ? 1.1 : 0.95);
          const color = isHead ? (snake.skin?.head || customSkin.head) : (snake.skin?.body || customSkin.body);

          ctx.shadowColor = color;
          ctx.shadowBlur = isHead ? 20 : 12;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(x + (cell - size)/2, y + (cell - size)/2, size, size, size * 0.4);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Simple solid pattern overlay (later selectable)
          if (i > 0) {
            ctx.globalAlpha = 0.25;
            ctx.drawImage(
              document.createElement("canvas"), // placeholder — use SolidPattern logic in canvas
              x, y, cell, cell
            );
            ctx.globalAlpha = 1;
          }
        });
        ctx.restore();

        // Name
        if (snake.body[0]) {
          const hx = ox + snake.body[0].x * cell + cell / 2;
          const hy = oy + snake.body[0].y * cell - cell * 0.7;
          ctx.fillStyle = snake.id === gameState.myId ? "#0ddff2" : "white";
          ctx.font = `${cell * 0.45}px Space Grotesk, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(snake.name || "Player", hx, hy);
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, gridSize, customSkin]);

  const handleRespawn = () => {
    setGameOver(false);
    setScore(0);
    setLength(1);
    socketRef.current?.emit("respawn");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-[#102122] font-['Space_Grotesk'] text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Top Bar */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-[#102122]/80 backdrop-blur-md border-b border-[#224649]">
        <div className="flex items-center gap-4">
          <MdSportsEsports className="text-3xl text-[#0ddff2]" />
          <h2 className="text-xl font-bold">
            Snake Arena <span className="text-[#0ddff2] font-light">v2.0</span>
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#" className="hover:text-[#0ddff2]">How to Play</a>
            <a href="#" className="hover:text-[#0ddff2]">Skins</a>
            <a href="#" className="hover:text-[#0ddff2]">Marketplace</a>
          </nav>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-[#224649] hover:bg-[#316368]">
              <MdSettings />
            </button>
            <button className="p-2 rounded-full bg-[#224649] hover:bg-[#316368]">
              <MdVolumeUp />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-[#183234] px-4 py-1 rounded-full border border-[#224649]">
            <span className="text-sm font-bold text-[#0ddff2]">LVL 1</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
          </div>
        </div>
      </header>

      {/* Bottom HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-full px-4">
        <div className="bg-[#183234]/90 backdrop-blur-lg border border-[#316368] rounded-2xl p-5 shadow-2xl">
          <div className="flex justify-between items-center gap-10">
            <div className="flex gap-12">
              <div>
                <div className="text-xs text-[#90c6cb] uppercase">Length</div>
                <div className="text-3xl font-bold">{length}</div>
              </div>
              <div>
                <div className="text-xs text-[#90c6cb] uppercase">Score</div>
                <div className="text-3xl font-bold text-[#0ddff2]">{score}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300 mb-1">Hold SPACE to boost</div>
              <div className={`font-bold ${boostRef.current ? "text-[#0ddff2] animate-pulse" : "text-gray-500"}`}>
                {boostRef.current ? "BOOSTING" : "READY"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Sidebar (mock) */}
      <aside className="absolute top-0 right-0 bottom-0 w-80 bg-[#102122]/90 backdrop-blur-md border-l border-[#224649] z-30 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <MdLeaderboard className="text-[#0ddff2]" /> Top Hunters
          </h3>
          {/* Mock leaderboard entries */}
          {[1,2,3,4].map(rank => (
            <div key={rank} className="flex items-center gap-4 p-3 rounded-xl bg-[#183234]/60 mb-3 hover:bg-[#224649]/60 transition">
              <span className="text-[#90c6cb] font-bold w-6">{rank}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div className="flex-1">
                <p className="font-medium truncate">Player{rank}</p>
                <p className="text-sm text-[#90c6cb]">{Math.floor(Math.random()*15000)+5000} pts</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50">
          <h1 className="text-7xl font-black text-red-500 mb-6">GAME OVER</h1>
          <p className="text-3xl mb-10">Score: {score} • Length: {length}</p>
          <button
            onClick={handleRespawn}
            className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-2xl font-bold hover:scale-105 transition"
          >
            Respawn
          </button>
        </div>
      )}

      {/* Simple skin preview (later → modal) */}
      <div className="absolute top-20 left-6 z-40 bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-[#316368]">
        <p className="text-sm mb-2">Your Skin Preview</p>
        <div className="flex gap-3">
          <SolidPattern color={customSkin.head} size={48} />
          <SolidPattern color={customSkin.body} size={48} />
        </div>
        {/* Later: color pickers + pattern selector */}
      </div>
    </div>
  );
};

export default Canvas;