import React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { Snake } from "../types/game";

interface LeaderboardProps {
  snakes: Snake[];
  myId: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ snakes, myId }) => {
  const sorted = [...snakes].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <aside className="absolute top-0 right-0 bottom-0 w-72 bg-[#102122]/90 backdrop-blur-sm border-l border-[#224649] z-30 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-5 text-white/90">Top Hunters</h3>

        <LayoutGroup>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <AnimatePresence mode="popLayout">
              {sorted.map((s, i) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 350, damping: 25 },
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
                    ${
                      s.id === myId
                        ? "bg-[#0ddff2]/20 border border-[#0ddff2]"
                        : "bg-[#183234]/60 hover:bg-[#0ddff2]/10"
                    }
                    transition-colors duration-150`}
                >
                  <span className="w-6 font-bold text-white text-sm">{i + 1}</span>

                  <div
                    className="w-9 h-9 rounded-full border border-[#0ddff2] bg-gradient-to-br from-[#78ffd6] to-[#0ddff2]"
                  />

                  <div className="flex-1 flex flex-col">
                    <p className="font-medium truncate text-white">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.score || 0} pts</p>
                  </div>

                  {i === 0 && (
                    <span className="text-yellow-400 font-bold">★</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </aside>
  );
};

export default Leaderboard;
