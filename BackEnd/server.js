import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { WIDTH, HEIGHT, TICK_RATE } from "./game/constants.js";
import { createSnake, gameTick } from "./game/snake.js";
import { rooms, getSafeRoomData, getSafeSnake, getActiveRooms, broadcastGlobalPlayers } from "./utils/rooms.js";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

const PORT = 3000;

io.on("connection", socket => {
  let currentRoomId = null;

  socket.on("pingCheck", callback => callback());

  // CREATE ROOM
  socket.on("createRoom", data => {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    const maxPlayers = data?.maxPlayers || 10;

    const room = {
      id: roomId,
      snakes: [],
      food: null,
      interval: null,
      maxPlayers
    };

    // initial food
    import("./game/foodGeneration.js").then(module => {
      room.food = module.generateFood([]);
      room.interval = setInterval(() => gameTick(room, io, getSafeSnake), 1000 / TICK_RATE);
      rooms[roomId] = room;

      socket.emit("room-created", getSafeRoomData(room));
      io.emit("rooms-updated", getActiveRooms());
    });
  });

  // JOIN ROOM
  socket.on("joinRoom", data => {
    const { roomId, name, skin } = data;
    const room = rooms[roomId];
    if (!room) return socket.emit("error", { message: "Room does not exist!" });
    if (room.snakes.length >= room.maxPlayers) return socket.emit("error", { message: "Room full!" });

    currentRoomId = roomId;

    const snake = createSnake(socket.id, name, skin, room);
    room.snakes.push(snake);
    socket.join(roomId);

    broadcastGlobalPlayers(io);

    socket.emit("init", {
      myId: socket.id,
      snakes: room.snakes.map(getSafeSnake),
      food: room.food,
      width: WIDTH,
      height: HEIGHT
    });

    io.to(roomId).emit("update", {
      snakes: room.snakes.map(getSafeSnake),
      food: room.food
    });

    io.emit("rooms-updated", getActiveRooms());
  });

  // CHANGE DIRECTION
  socket.on("directionChange", newDir => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (!snake || snake.dead) return;

    const valid = ["UP", "DOWN", "LEFT", "RIGHT"];
    if (!valid.includes(newDir)) return;

    const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (snake.body.length > 1 && opposites[snake.direction] === newDir) return;

    snake.direction = newDir;
  });

  // BOOST
  socket.on("boost", enabled => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    const snake = room.snakes.find(s => s.id === socket.id);
    if (!snake || snake.dead) return;

    snake.boost = enabled && snake.stamina > 0;
  });

  // RESPAWN
  socket.on("respawn", () => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    const oldSnake = room.snakes.find(s => s.id === socket.id);
    room.snakes = room.snakes.filter(s => s.id !== socket.id);

    import("./game/foodGeneration.js").then(module => {
      const newSnake = createSnake(socket.id, oldSnake?.name, oldSnake?.skin, room);
      room.snakes.push(newSnake);

      socket.emit("respawnSuccess");
      io.to(currentRoomId).emit("update", {
        snakes: room.snakes.map(getSafeSnake),
        food: room.food
      });
      broadcastGlobalPlayers(io);
    });
  });

  // GET ACTIVE ROOMS
  socket.on("get-active-rooms", () => {
    socket.emit("active-rooms", getActiveRooms());
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    if (!currentRoomId) return;
    const room = rooms[currentRoomId];
    if (!room) return;

    room.snakes = room.snakes.filter(s => s.id !== socket.id);

    io.to(currentRoomId).emit("update", {
      snakes: room.snakes.map(getSafeSnake),
      food: room.food
    });

    if (room.snakes.length === 0) {
      clearInterval(room.interval);
      delete rooms[currentRoomId];
      console.log(`Room ${currentRoomId} deleted (empty)`);
    }

    broadcastGlobalPlayers(io);
    io.emit("rooms-updated", getActiveRooms());
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
