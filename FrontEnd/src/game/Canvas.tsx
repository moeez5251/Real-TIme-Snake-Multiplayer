import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Direction, Snake, GameState, SnakeSkin, PatternType } from "./types/game";
import HUD from "./components/HUD";
import Leaderboard from "./components/Leaderboard";
import Alerts from "./components/Alerts";
import Navbar from "./components/navbar";
import Popup from "./components/popup";
import { SolidPattern, StripesPattern, DotsPattern, GlowPattern } from "./components/PatternComponents";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useSound } from "../context/sound";
const Canvas: React.FC = () => {
  const {playSound,stopSound}=useSound()
  let params = useParams();
  let navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const animationRef = useRef<number | null>(null);
  const myIdRef = useRef<string | null>(null);
  const deadRef = useRef(false);
  const staminaRef = useRef<number>(100);
  const ROOM_ID = useRef("")
  const storedSkin = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('equippedSkin') || '{}')
    : {}
  const DEFAULT_SKIN: SnakeSkin = { head: storedSkin.color || "#00f2ff", body: storedSkin.color || "#00f2ff", pattern: storedSkin.pattern || "Solid" };
  const [customSkin, setCustomSkin] = useState<SnakeSkin>(DEFAULT_SKIN);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySnake, setMySnake] = useState<Snake | null>(null);
  const [gridSize, setGridSize] = useState(28);
  const [boosting, setBoosting] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const directionRef = useRef<Direction>("RIGHT");

  const addAlert = (msg: string) => {
    setAlerts(prev => [...prev, msg]);
    setTimeout(() => setAlerts(prev => prev.slice(1)), 4000);
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
      transports: ["websocket","polling"],
      reconnection: true,
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      socket.emit("joinRoom", { roomId: ROOM_ID.current, name: localStorage.getItem("username") || "Anonymous", skin: customSkin });
      addAlert("Connected ✅");
    });
    socket.on("error", () => { navigate("/lobby") })
    socket.on("disconnect", () => addAlert("Disconnected ❌ Reconnecting..."));

    socket.on("init", (data: GameState) => {
      setGameState(data);
      myIdRef.current = data.myId;
      const me = data.snakes.find(s => s.id === data.myId) || null;
      setMySnake(me);
      deadRef.current = false;
      staminaRef.current = me?.stamina ?? 100;
      setGameOver(false);
    });

    socket.on("update", (data: GameState) => {
      const aliveSnakes = data.snakes.filter(s => !s.dead);
      setGameState({ ...data, snakes: aliveSnakes });

      const myId = myIdRef.current;
      if (!myId) return;
      const me = data.snakes.find(s => s.id === myId) || null;
      setMySnake(me);

      if (me?.dead && !deadRef.current) {
        deadRef.current = true;
        setGameOver(true);
        addAlert("You Died! Press Respawn 🔄");
      } else if (me && !me.dead) {
        deadRef.current = false;
        setGameOver(false);
      }

      if (me?.stamina !== undefined) staminaRef.current = me.stamina;
    });

    socket.on("respawnSuccess", () => {
      addAlert("Respawned ✅");
      staminaRef.current = 100;
      setBoosting(false);
      setGameOver(false);
      deadRef.current = false;
    });

    return () => {
      socket.disconnect();
    };
  }, [customSkin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mySnake || mySnake.dead || gameOver) return;
      e.preventDefault();

      let newDir: Direction | null = null;
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup": newDir = "UP"; break;
        case "s":
        case "arrowdown": newDir = "DOWN"; break;
        case "a":
        case "arrowleft": newDir = "LEFT"; break;
        case "d":
        case "arrowright": newDir = "RIGHT"; break;
        case " ":
          if (!boosting && staminaRef.current > 0) {
            setBoosting(true);
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
        setBoosting(false);
        socketRef.current?.emit("boost", false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [boosting, mySnake, gameOver]);

  useEffect(() => {
    if (!boosting) return;
    const interval = setInterval(() => {
      staminaRef.current = Math.max(0, staminaRef.current - 2);
      if (staminaRef.current <= 0) {
        setBoosting(false);
        socketRef.current?.emit("boost", false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [boosting]);

  const updateGrid = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if (!gameState) {
      setGridSize(28);
      return;
    }

    const scale = Math.min(c.width / (gameState.width * 28), c.height / (gameState.height * 28));
    setGridSize(Math.max(16, Math.round(28 * scale)));
  }, [gameState]);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  const drawSnakeCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cell: number,
    skin: SnakeSkin,
    pattern: PatternType,
    isHead: boolean,
    boosting: boolean
  ) => {
    switch (pattern) {
      case "Solid": SolidPattern({ ctx, x, y, cell, skin, isHead, boosting }); break;
      case "Stripes": StripesPattern({ ctx, x, y, cell, skin, isHead, boosting }); break;
      case "Dots": DotsPattern({ ctx, x, y, cell, skin, isHead, boosting }); break;
      case "Glow": GlowPattern({ ctx, x, y, cell, skin, isHead, boosting }); break;
      default: SolidPattern({ ctx, x, y, cell, skin, isHead, boosting });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!gameState) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const cell = gridSize;
      const gameW = gameState.width * cell;
      const gameH = gameState.height * cell;
      const ox = (canvas.width - gameW) / 2;
      const oy = (canvas.height - gameH) / 2;

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

      gameState.snakes.forEach(snake => {
        if (snake.dead || !snake.body?.length) return;
        ctx.save();

        const isBoosting = snake.boost;
        snake.body.forEach((seg, i) => {
          const x = ox + seg.x * cell;
          const y = oy + seg.y * cell;
          const isHead = i === 0;
          drawSnakeCell(ctx, x, y, cell, snake.skin || DEFAULT_SKIN, snake.skin?.pattern || "Solid", isHead, isBoosting);
        });

        ctx.restore();

        if (snake.body[0]) {
          const hx = ox + snake.body[0].x * cell + cell / 2;
          const hy = oy + snake.body[0].y * cell - cell * 0.7;
          ctx.fillStyle = snake.id === myIdRef.current ? "#0ff" : "#fff";
          ctx.font = `${cell * 0.45}px Space Grotesk, sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 6;
          ctx.fillText(snake.name || "Player", hx, hy);
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, gridSize]);
  useEffect(() => {
    ROOM_ID.current = params.id || "";
    return () => {

    }
  }, [params])
  useEffect(() => {
    stopSound("lobby")
    return () => {
      
    }
  },[])


  const handleRespawn = () => {
    socketRef.current?.emit("respawn");
    setGameOver(false);
  };

  return (
    <div className="fixed inset-0 bg-[#102122] font-['Space_Grotesk'] text-white overflow-hidden">
      <Navbar setShowHowToPlay={setShowHowToPlay} />
      {showHowToPlay && <Popup setShowHowToPlay={setShowHowToPlay} />}

      <canvas ref={canvasRef} className="absolute inset-0" />

      <HUD
        mySnake={mySnake}
        boosting={boosting}
        stamina={staminaRef.current}
        onRespawn={handleRespawn}
        customSkin={customSkin}
      />
      <Leaderboard snakes={gameState?.snakes || []} myId={myIdRef.current} />
      <Alerts alerts={alerts} />

      {gameOver && mySnake && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          <h1 className="text-7xl font-black text-red-500 mb-6">GAME OVER</h1>
          <p className="text-3xl mb-10">
            Score: {mySnake.score ?? 0} • Length: {mySnake.body?.length ?? 0}
          </p>
          <div className="flex items-center gap-4">

            <button
              onClick={handleRespawn}
              className="px-12 py-5 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl text-2xl font-bold hover:scale-105 transition shadow-lg"
            >
              Respawn
            </button>
            <button
              onClick={()=> navigate("/lobby")}
              className="px-12 py-5 bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl text-2xl font-bold hover:scale-105 transition shadow-lg"
            >
              Back to Lobby
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Canvas;
