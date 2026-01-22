import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronRight, FaLock, FaBolt } from "react-icons/fa";
import { socket } from "../game/hooks/socket";
import { useNavigate } from "react-router-dom";

interface Room {
  roomId: string;
  players: number;
  maxPlayers?: number;
  mode?: string;
  locked?: boolean;
  ping?: number;
}

const getPingColor = (ping: number) => {
  if (ping <= 20) return "text-[#39ff14]";
  if (ping <= 50) return "text-[#0ddff2]";
  return "text-[#ff4d4d]";
};

const ActiveRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit("get-active-rooms");

    socket.on("active-rooms", setRooms);
    socket.on("rooms-updated", setRooms);

    return () => {
      socket.off("active-rooms");
      socket.off("rooms-updated");
    };
  }, []);

  const handleJoinRoom = (room: Room) => {
    if (room.locked || room.players >= (room.maxPlayers ?? 50)) {
      alert("This room is full or locked!");
      return;
    }
    navigate(`/room/${room.roomId}`);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="space-y-3 overflow-y-auto pr-2 max-h-[350px]"
    >
      {rooms.length === 0 && (
        <div className="text-center text-slate-500 text-sm">
          No active rooms
        </div>
      )}

      {rooms.map((room) => {
        const max = room.maxPlayers ?? 50;
        const ping = room.ping ?? Math.floor(10 + Math.random() * 40);
        const isFull = room.players >= max;
        const locked = room.locked || isFull;

        return (
          <motion.div
            key={room.roomId}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center justify-between p-4 rounded-xl
                       bg-[#102122] border border-slate-700
                       hover:border-[#0ddff2]/50 transition-colors
                       group cursor-pointer"
            onClick={() => handleJoinRoom(room)}
          >
            <div className="flex flex-col">
              <span className="font-bold text-white group-hover:text-[#0ddff2] transition-colors">
                {room.roomId}
              </span>

              <span className="text-xs text-slate-500 flex items-center gap-2">
                <FaBolt className={getPingColor(ping)} />
                {room.mode ?? "Classic Mode"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-sm font-bold text-white">
                  {room.players}/{max}
                </span>
              
              </div>

              <span className="text-slate-500 group-hover:text-[#0ddff2]">
                {locked ? <FaLock /> : <FaChevronRight />}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ActiveRooms;
