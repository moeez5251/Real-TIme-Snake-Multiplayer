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

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

function createSnake(socketId, name, skin, room) {
  let x, y;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    x = Math.floor(Math.random() * WIDTH);
    y = Math.floor(Math.random() * HEIGHT);
    attempts++;
  } while (
    attempts < maxAttempts &&
    room.snakes.some(s => s.body.some(seg => seg.x === x && seg.y === y))
  );

  // fallback — very unlikely but prevents infinite loop
  if (attempts >= maxAttempts) {
    x = Math.floor(WIDTH / 2);
    y = Math.floor(HEIGHT / 2);
  }

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

function gameTick(room) {
  if (!room) return;

  const { snakes, food } = room;

  // We'll collect new food position only if eaten
  let newFood = null;

  snakes.forEach(snake => {
    if (snake.dead) return;

    // Regenerate stamina when not boosting
    if (!snake.boost) {
      snake.stamina = Math.min(100, snake.stamina + 0.2); // smoother regen
    }

    const head = { ...snake.body[0] };

    // Move (boost = 2 steps, normal = 1)
    const steps = snake.boost && snake.stamina > 0 ? 2 : 1;

    for (let i = 0; i < steps; i++) {
      switch (snake.direction) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      // Wall collision → instant death
      if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
        snake.dead = true;
        return;
      }

      // Self collision (ignore head)
      if (snake.body.some((seg, idx) => idx > 0 && seg.x === head.x && seg.y === head.y)) {
        snake.dead = true;
        return;
      }

      // Other snakes collision
      const hitOther = snakes.some(other =>
        other.id !== snake.id &&
        !other.dead &&
        other.body.some(seg => seg.x === head.x && seg.y === head.y)
      );

      if (hitOther) {
        snake.dead = true;
        return;
      }
    }

    // Actually move — add new head
    snake.body.unshift(head);

    // Eat food?
    if (head.x === food.x && head.y === food.y) {
      newFood = generateFood(snakes);
      snake.score += 1;
      // do NOT pop tail → snake grows
    } else {
      snake.body.pop();
    }

    // Boost stamina drain (applied after move)
    if (snake.boost) {
      snake.stamina = Math.max(0, snake.stamina - 3); // adjust value to taste
      if (snake.stamina <= 0) {
        snake.boost = false;
      }
    }
  });

  // Update food if eaten
  if (newFood) {
    room.food = newFood;
  }

  // Optional: filter out dead snakes (cleaner client state)
  // room.snakes = snakes.filter(s => !s.dead);

  // Send update to everyone in room
  io.to(room.id).emit("update", {
    snakes: room.snakes.map(s => ({
      id: s.id,
      name: s.name,
      skin: s.skin,
      direction: s.direction,
      boost: s.boost,
      stamina: Math.round(s.stamina),
      score: s.score,
      body: [...s.body],
      dead: s.dead
    })),
    food: room.food,
    width: WIDTH,
    height: HEIGHT
  });
}

io.on("connection", socket => {
  let currentRoomId = null;
  socket.on("pingCheck", (callback) => {
    callback(); 
  });
  socket.on("joinRoom", ({ rId, name, skin }) => {
    currentRoomId = rId;

    if (!rooms[currentRoomId]) {
      rooms[currentRoomId] = {
        id: currentRoomId,
        snakes: [],
        food: generateFood([]),
        interval: setInterval(() => gameTick(rooms[currentRoomId]), 1000 / TICK_RATE)
      };
      console.log(`Created room: ${currentRoomId}`);
    }

    const room = rooms[currentRoomId];

    const snake = createSnake(socket.id, name, skin, room);
    room.snakes.push(snake);
    socket.join(currentRoomId);

    // Send full init to the joining player
    socket.emit("init", {
      myId: socket.id,
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food,
      width: WIDTH,
      height: HEIGHT
    });

    // Broadcast update to everyone
    io.to(currentRoomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Player joined: ${name} (${socket.id}) → room ${currentRoomId}`);
  });

  socket.on("directionChange", newDir => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (!snake || snake.dead) return;

    const valid = ["UP", "DOWN", "LEFT", "RIGHT"];
    if (!valid.includes(newDir)) return;

    // Prevent 180° turn when body > 1
    const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (snake.body.length > 1 && opposites[snake.direction] === newDir) {
      return;
    }

    snake.direction = newDir;
  });

  socket.on("boost", enabled => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (!snake || snake.dead) return;

    // Only allow boost if stamina > 0
    snake.boost = enabled && snake.stamina > 0;
  });

  socket.on("respawn", () => {
    if (!currentRoomId || !rooms[currentRoomId]) return;

    const room = rooms[currentRoomId];
    const oldSnake = room.snakes.find(s => s.id === socket.id);

    // Remove old snake
    room.snakes = room.snakes.filter(s => s.id !== socket.id);

    // Create new one
    const newSnake = createSnake(
      socket.id,
      oldSnake?.name || "Player",
      oldSnake?.skin,
      room
    );

    room.snakes.push(newSnake);

    // Tell this player they respawned
    socket.emit("respawnSuccess");

    // Send fresh state to everyone
    io.to(currentRoomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Respawn: ${socket.id} → (${newSnake.body[0].x}, ${newSnake.body[0].y})`);
  });

  socket.on("disconnect", () => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    room.snakes = room.snakes.filter(s => s.id !== socket.id);

    io.to(currentRoomId).emit("update", {
      snakes: room.snakes.map(s => ({ ...s, body: [...s.body] })),
      food: room.food
    });

    console.log(`Disconnected ${socket.id} — room ${currentRoomId} now has ${room.snakes.length} players`);

    // Clean up empty room
    if (room.snakes.length === 0) {
      clearInterval(room.interval);
      delete rooms[currentRoomId];
      console.log(`Room ${currentRoomId} deleted (empty)`);
    }
  });
});