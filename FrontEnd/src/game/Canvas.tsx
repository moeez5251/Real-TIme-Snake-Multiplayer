import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Direction, Snake, GameState, SnakeSkin, PatternType } from "./types/game";
import HUD from "./components/HUD";
import Leaderboard from "./components/Leaderboard";
import Alerts from "./components/Alerts";
import Navbar from "./components/navbar";
import Popup from "./components/popup";
import { SolidPattern, StripesPattern, DotsPattern, GlowPattern } from "./components/PatternComponents";
import { useParams, useNavigate } from "react-router";
import { useSound } from "../context/sound";
import useIsMobile from "./hooks/isinmobile";
import Control from "./components/controlbar";
const Canvas: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const HudeRef = useRef<HTMLDivElement | null>(null)
  const [hud, sethud] = useState(false)
  const lastFoodRef = useRef<{ x: number; y: number } | null>(null);
  const [leaderboard, setleaderboard] = useState(false)
  const isMobile = useIsMobile({ width: 1300 });
  const { playSound, stopSound } = useSound();
  const params = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const animationRef = useRef<number | null>(null);

  const myIdRef = useRef<string | null>(null);
  const deadRef = useRef(false);
  const staminaRef = useRef<number>(100);
  const ROOM_ID = useRef("");
  const directionRef = useRef<Direction>("RIGHT");

  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const touchActiveRef = useRef(false);

  const storedSkin =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("equippedSkin") || "{}")
      : {};

  const DEFAULT_SKIN: SnakeSkin = {
    head: storedSkin.color || "#00f2ff",
    body: storedSkin.color || "#00f2ff",
    pattern: storedSkin.pattern || "Solid",
  };

  const [customSkin] = useState<SnakeSkin>(DEFAULT_SKIN);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySnake, setMySnake] = useState<Snake | null>(null);

  const [gridSize, setGridSize] = useState(16);
  const [boosting, setBoosting] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [alerts, setAlerts] = useState<string[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const addAlert = (msg: string) => {
    setAlerts((prev) => [...prev, msg]);
    setTimeout(() => setAlerts((prev) => prev.slice(1)), 4000);
  };

  useEffect(() => {
    ROOM_ID.current = params.id || "";
  }, [params]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", {
        roomId: ROOM_ID.current,
        name: localStorage.getItem("username")
          ? JSON.parse(localStorage.getItem("username")!)
          : "Guest",
        skin: customSkin,
      });
      addAlert("Connected ✅");
    });

    socket.on("error", () => navigate("/lobby"));
    socket.on("disconnect", () => addAlert("Disconnected ❌ Reconnecting..."));

    socket.on("init", (data: GameState) => {
      setGameState(data);
      myIdRef.current = data.myId;

      const me = data.snakes.find((s) => s.id === data.myId) || null;
      setMySnake(me);

      staminaRef.current = me?.stamina ?? 100;
      deadRef.current = false;

      setGameOver(false);
    });

    socket.on("update", (data: GameState) => {
      const myId = myIdRef.current;
      if (!myId) return;

      const me = data.snakes.find((s) => s.id === myId) || null;
      setMySnake(me);

      setGameState({
        ...data,
        snakes: data.snakes.filter((s) => !s.dead),
      });

      if (me && me.body?.length && data.food) {
        const head = me.body[0];

        if (
          lastFoodRef.current &&
          head.x === lastFoodRef.current.x &&
          head.y === lastFoodRef.current.y
        ) {
          playSound("eat");
        }

        lastFoodRef.current = { x: data.food.x, y: data.food.y };
      }

      if (me?.dead && !deadRef.current) {
        deadRef.current = true;
        playSound("death");
        setGameOver(true);
        addAlert("You Died! Swipe or press Respawn 🔄");
      }

      if (me && !me.dead) {
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
  }, [customSkin, navigate, playSound]);

  const emitDirection = useCallback(
    (newDir: Direction) => {
      if (!mySnake || mySnake.dead || gameOver) return;
      if (newDir === directionRef.current) return;

      directionRef.current = newDir;
      socketRef.current?.emit("directionChange", newDir);
      playSound("click");
    },
    [mySnake, gameOver, playSound]
  );

  const startBoost = useCallback(() => {
    if (!mySnake || mySnake.dead || gameOver) return;
    if (boosting || staminaRef.current <= 0) return;
    setBoosting(true);
    socketRef.current?.emit("boost", true);
    playSound("boost");
  }, [mySnake, gameOver, boosting, playSound]);

  const stopBoost = useCallback(() => {
    if (!boosting) return;
    setBoosting(false);
    socketRef.current?.emit("boost", false);
  }, [boosting]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mySnake || mySnake.dead || gameOver) return;
      e.preventDefault();

      let newDir: Direction | null = null;

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          newDir = "UP";
          break;
        case "s":
        case "arrowdown":
          newDir = "DOWN";
          break;
        case "a":
        case "arrowleft":
          newDir = "LEFT";
          break;
        case "d":
        case "arrowright":
          newDir = "RIGHT";
          break;
        case " ":
          startBoost();
          return;
      }

      if (newDir) emitDirection(newDir);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") stopBoost();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [mySnake, gameOver, emitDirection, startBoost, stopBoost]);

  useEffect(() => {
    if (!boosting) return;

    const interval = setInterval(() => {
      staminaRef.current = Math.max(0, staminaRef.current - 2);
      if (staminaRef.current <= 0) {
        stopBoost();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [boosting, stopBoost]);

  const updateGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;

    canvas.width = Math.floor(vw * dpr);
    canvas.height = Math.floor(vh * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!gameState) return;

    const pad = 12;
    const usableW = Math.max(1, vw - pad * 2);
    const usableH = Math.max(1, vh - pad * 2);

    let fitCell = Math.floor(
      Math.min(usableW / gameState.width, usableH / gameState.height)
    );

    const scaleUp = 1.2;
    fitCell = Math.floor(fitCell * scaleUp);

    const maxCellW = Math.floor(usableW / gameState.width);
    const maxCellH = Math.floor(usableH / gameState.height);
    const safeMax = Math.min(maxCellW, maxCellH);

    fitCell = Math.min(fitCell, safeMax);

    setGridSize(Math.max(6, fitCell));
  }, [gameState]);

  useEffect(() => {
    updateGrid();

    const vv = window.visualViewport;

    window.addEventListener("resize", updateGrid);
    vv?.addEventListener("resize", updateGrid);
    vv?.addEventListener("scroll", updateGrid);

    return () => {
      window.removeEventListener("resize", updateGrid);
      vv?.removeEventListener("resize", updateGrid);
      vv?.removeEventListener("scroll", updateGrid);
    };
  }, [updateGrid]);

  const drawSnakeCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cell: number,
    skin: SnakeSkin,
    pattern: PatternType,
    isHead: boolean,
    boostingLocal: boolean
  ) => {
    switch (pattern) {
      case "Solid":
        SolidPattern({ ctx, x, y, cell, skin, isHead, boosting: boostingLocal });
        break;
      case "Stripes":
        StripesPattern({ ctx, x, y, cell, skin, isHead, boosting: boostingLocal });
        break;
      case "Dots":
        DotsPattern({ ctx, x, y, cell, skin, isHead, boosting: boostingLocal });
        break;
      case "Glow":
        GlowPattern({ ctx, x, y, cell, skin, isHead, boosting: boostingLocal });
        break;
      default:
        SolidPattern({ ctx, x, y, cell, skin, isHead, boosting: boostingLocal });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;

      ctx.clearRect(0, 0, vw, vh);

      if (!gameState) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const cell = gridSize;
      const gameW = gameState.width * cell;
      const gameH = gameState.height * cell;

      const ox = (vw - gameW) / 2;
      const oy = (vh - gameH) / 2;

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

      gameState.snakes.forEach((snake) => {
        if (snake.dead || !snake.body?.length) return;

        snake.body.forEach((seg, i) => {
          const x = ox + seg.x * cell;
          const y = oy + seg.y * cell;

          drawSnakeCell(
            ctx,
            x,
            y,
            cell,
            snake.skin || DEFAULT_SKIN,
            snake.skin?.pattern || "Solid",
            i === 0,
            snake.boost
          );
        });

        if (snake.body[0]) {
          const hx = ox + snake.body[0].x * cell + cell / 2;
          const hy = oy + snake.body[0].y * cell - cell * 0.7;

          ctx.fillStyle = snake.skin?.head || DEFAULT_SKIN.head;
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
    stopSound("lobby");
  }, [stopSound]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !isMobile) return;

    const minSwipe = 18;
    const maxTapMs = 220;
    const boostTapMaxMove = 10;

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches.length) return;
      touchActiveRef.current = true;
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchActiveRef.current) return;
      if (!touchStartRef.current) return;

      const t = e.touches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < minSwipe && absY < minSwipe) return;

      if (absX > absY) {
        emitDirection(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        emitDirection(dy > 0 ? "DOWN" : "UP");
      }

      touchActiveRef.current = false;
      touchStartRef.current = null;
    };

    const onTouchEnd = () => {
      if (!touchStartRef.current) {
        touchActiveRef.current = false;
        return;
      }

      const dt = Date.now() - touchStartRef.current.t;
      touchActiveRef.current = false;

      if (dt <= maxTapMs) {
        const dx = 0;
        const dy = 0;
        const dist = Math.hypot(dx, dy);
        if (dist <= boostTapMaxMove) {
          startBoost();
          setTimeout(() => stopBoost(), 160);
        }
      }

      touchStartRef.current = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      if (!isMobile) return
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd as any);
      el.removeEventListener("touchcancel", onTouchEnd as any);
    };
  }, [emitDirection, startBoost, stopBoost]);

  const handleRespawn = () => {
    playSound("click");
    socketRef.current?.emit("respawn");
    setGameOver(false);
  };
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setleaderboard(false);
      }
      if (
        HudeRef.current &&
        !HudeRef.current.contains(e.target as Node)
      ) {
        sethud(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])
  return (
    <div className="fixed inset-0 bg-[#102122] text-white overflow-hidden touch-none select-none">
      <Navbar setShowHowToPlay={setShowHowToPlay} />
      {
        isMobile &&
        <Control hudestate={sethud} leaderboardstate={setleaderboard} />
      }
      {showHowToPlay && <Popup setShowHowToPlay={setShowHowToPlay} />}

      <canvas ref={canvasRef} className="absolute inset-0" />
      {(!isMobile || hud )&&
        <HUD
          mySnake={mySnake}
          boosting={boosting}
          stamina={staminaRef.current}
          onRespawn={handleRespawn}
          customSkin={customSkin}
          roomId={ROOM_ID.current}
          ref={HudeRef}
        />}

      {
       (!isMobile || leaderboard) &&
        <Leaderboard ref={sidebarRef} snakes={gameState?.snakes || []} myId={myIdRef.current} />
      }
      <Alerts alerts={alerts} />

      {gameOver && mySnake && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          <h1 className="text-5xl sm:text-7xl font-black text-red-500 mb-6">GAME OVER</h1>
          <p className="text-xl sm:text-3xl mb-10">
            Score: {mySnake.score ?? 0} • Length: {mySnake.body?.length ?? 0}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleRespawn}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-xl sm:text-2xl font-bold hover:scale-105 transition"
            >
              Respawn
            </button>
            <button
              onClick={() => navigate("/lobby")}
              className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-xl sm:text-2xl font-bold hover:scale-105 transition"
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
