export const rooms = {};

export function getSafeRoomData(room) {
  if (!room) return null;
  const { interval, ...safe } = room;
  return safe;
}

export function getSafeSnake(snake) {
  return {
    id: snake.id,
    name: snake.name,
    skin: snake.skin,
    direction: snake.direction,
    boost: snake.boost,
    stamina: snake.stamina,
    score: snake.score,
    body: [...snake.body],
    dead: snake.dead
  };
}

export function getActiveRooms() {
  return Object.values(rooms).map(room => ({
    roomId: room.id,
    players: room.snakes.length,
    maxPlayers: room.maxPlayers
  }));
}

export function broadcastGlobalPlayers(io) {
  if (!io) return;
  const allPlayers = Object.values(rooms).flatMap(room =>
    room.snakes.map(snake => ({
      playerId: snake.id,
      name: snake.name,
      roomId: room.id,
      score: snake.score,
      isDead: snake.dead
    }))
  );

  io.emit("players-updated", allPlayers);
}
