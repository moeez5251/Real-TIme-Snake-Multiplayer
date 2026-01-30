import React from "react";
import { SolidPattern, StripesPattern, DotsPattern, GlowPattern } from "../../components/solidpatterns";
import type { Snake } from "../types/game";
import { useSocket } from "../hooks/useSocket";
import { motion } from "framer-motion";
interface HUDProps {
  mySnake: Snake | null;
  boosting: boolean;
  stamina: number;
  onRespawn: () => void;
  customSkin: any;
  roomId: string
  ref: React.RefObject<HTMLDivElement | null>;
}
const HUD: React.FC<HUDProps> = ({ mySnake, boosting, stamina, onRespawn, customSkin, roomId, ref }) => {
  const { ping } = useSocket()
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={ref} className="absolute top-20 left-6 z-40 bg-[#183234]/90 p-4 rounded-2xl backdrop-blur-md border border-[#316368] w-52 sm:w-60">
      <div className="flex items-center gap-2 font-medium">
        Ping:
        <span
          className={`${ping < 50
            ? "text-green-400"
            : ping < 120
              ? "text-yellow-400"
              : "text-red-500"
            }`}
        >
          {ping} ms
        </span>
      </div>

      <p className="text-sm my-2">Length: {mySnake?.body.length || 0}</p>
      <p className="text-sm my-2">Score: {mySnake?.score || 0}</p>
      <p className="text-sm my-2">Room ID: {roomId || 0}</p>

      <p className="text-sm my-2">Boost: {boosting ? "ON" : "READY"} ({stamina.toFixed(0)})</p>
      <button
        onClick={onRespawn}
        className="px-4 py-2 mt-3 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl text-sm font-bold hover:scale-105 transition"
      >
        Respawn
      </button>

      <p className="text-sm mt-4 mb-2">Your Skin Preview</p>
      <div className="flex gap-2">
        {customSkin.pattern === "Solid" && <SolidPattern color={customSkin.head} size={32} />}
        {customSkin.pattern === "Stripes" && <StripesPattern color={customSkin.head} size={32} />}
        {customSkin.pattern === "Dots" && <DotsPattern color={customSkin.head} size={32} />}
        {customSkin.pattern === "Glow" && <GlowPattern color={customSkin.head} size={32} />}
      </div>
    </motion.div>
  );
};

export default HUD;
