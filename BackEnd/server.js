import express from "express";
import http from "http";
import { Server } from "socket.io";
import { TICK_RATE, WIDTH, HEIGHT } from "./game/constants.js";
import { generateFood } from "./game/foodgenration.js";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};
const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

function spawnSnake(socketId, name, skin, room) {
  let spawnX, spawnY;
  do {
    spawnX = Math.floor(Math.random() * WIDTH);
    spawnY = Math.floor(Math.random() * HEIGHT);
  } while (room.snakes.some(s => s.body.some(seg => seg.x === spawnX && seg.y === spawnY)));

  return {
    id: socketId,
    name: name || "Player",
    skin: skin || { head: "#a8ff78", body: "#78ffd6" },
    direction: "RIGHT",
    boost: false,
    score: 0,
    body: [{ x: spawnX, y: spawnY }],
    startX: spawnX,
    startY: spawnY,
    x: spawnX,
    y: spawnY,
    dead: false
  };
}

function gameTick(room) {
  if (!room) return;
  const { snakes, food } = room;

  snakes.forEach(snake => {
    if (snake.dead) return;

    if (!snake.boost) {
      snake.stamina = Math.min(100, (snake.stamina || 100) + 5);
    }

    if (snake.body.length === 0) {
      snake.body.push({ x: snake.startX, y: snake.startY });
      snake.x = snake.startX;
      snake.y = snake.startY;
    }

    const head = { ...snake.body[0] };
    const moveSpeed = snake.boost ? 2 : 1;

    for (let step = 0; step < moveSpeed; step++) {
      switch (snake.direction) {
        case "UP":    head.y -= 1; break;
        case "DOWN":  head.y += 1; break;
        case "LEFT":  head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      const hitWall = head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT;
      if (hitWall) {
        snake.dead = true;
        return;
      }
    }

    const hitSelf = snake.body.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y);
    const hitOther = snakes
      .filter(s => s.id !== snake.id && !s.dead)
      .some(s => s.body.some(seg => seg.x === head.x && seg.y === head.y));

    if (hitSelf || hitOther) {
      snake.dead = true;
      return;
    }

    snake.body.unshift(head);
    snake.x = head.x;
    snake.y = head.y;

    if (head.x === food.x && head.y === food.y) {
      room.food = generateFood(snakes);
      snake.score = (snake.score || 0) + 1;
    } else {
      snake.body.pop();
    }

    if (snake.boost) {
      snake.stamina = Math.max(0, (snake.stamina || 100) - 10);
      if (snake.stamina <= 0) {
      }
    }
  });

  room.snakes = snakes.filter(s => !s.dead);

  io.to(room.id).emit("update", {
    snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
    food: room.food
  });
}

io.on("connection", (socket) => {
  let roomId = null;

  socket.on("joinRoom", ({ rId, name, skin }) => {
    roomId = rId;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        snakes: [],
        food: generateFood([]),
        interval: setInterval(() => gameTick(rooms[roomId]), 1000 / TICK_RATE)
      };
      console.log(`Room created: ${roomId}`);
    }

    const room = rooms[roomId];

    const snake = spawnSnake(socket.id, name, skin, room);
    room.snakes.push(snake);
    socket.join(roomId);

    socket.emit("init", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food,
      myId: socket.id,
      width: WIDTH,
      height: HEIGHT
    });

    io.to(roomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Joined: ${name} (${socket.id}) → room ${roomId} | total players: ${room.snakes.length}`);
  });

  socket.on("directionChange", (newDirection) => {
    if (!roomId) return;
    const room = rooms[roomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (!snake || snake.dead) return;

    const valid = ["UP", "DOWN", "LEFT", "RIGHT"];
    if (!valid.includes(newDirection)) return;

    const opposite = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (snake.body.length > 1 && opposite[snake.direction] === newDirection) return;

    snake.direction = newDirection;
  });

  socket.on("boost", (state) => {
    if (!roomId) return;
    const room = rooms[roomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (snake && !snake.dead && snake.stamina > 0) {
      snake.boost = !!state;
    } else if (snake) {
      snake.boost = false;
    }
  });

  socket.on("respawn", () => {
    if (!roomId || !rooms[roomId]) {
      console.log(`Respawn failed: no room for ${socket.id}`);
      return;
    }

    const room = rooms[roomId];

    const oldSnake = room.snakes.find(s => s.id === socket.id);
    room.snakes = room.snakes.filter(s => s.id !== socket.id);

    const newSnake = spawnSnake(socket.id, oldSnake?.name || "Player", oldSnake?.skin || DEFAULT_SKIN, room);
    room.snakes.push(newSnake);

    socket.emit("respawnSuccess", { success: true, newPosition: { x: newSnake.x, y: newSnake.y } });

    socket.emit("init", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food,
      myId: socket.id,
      width: WIDTH,
      height: HEIGHT
    });

    io.to(roomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Respawn success: ${socket.id} → new pos ${newSnake.x},${newSnake.y}`);
  });

  socket.on("disconnect", (reason) => {
    if (!roomId) return;
    const room = rooms[roomId];
    if (!room) return;

    room.snakes = room.snakes.filter(s => s.id !== socket.id);
    io.to(roomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Disconnected: ${socket.id} | reason: ${reason} | remaining: ${room.snakes.length}`);

    if (room.snakes.length === 0) {
      clearInterval(room.interval);
      delete rooms[roomId];
      console.log(`Room ${roomId} deleted (empty)`);
    }
  });
});