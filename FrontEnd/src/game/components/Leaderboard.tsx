import React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { Snake } from "../types/game";

interface LeaderboardProps {
  snakes: Snake[];
  myId: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ snakes, myId }) => {
  const sorted = [...snakes]
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <aside className="absolute top-0 right-0 bottom-0 w-71.5 bg-[#102122]/90 backdrop-blur-md border-l border-[#224649] z-30 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-6">Top Hunters</h3>

        <LayoutGroup>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sorted.map((s, i) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30 
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -16, 
                    scale: 0.95,
                    transition: { duration: 0.25 }
                  }}
                  className={`flex items-center gap-4 p-3 rounded-xl mb-3 ${
                    s.id === myId ? "bg-[#0ddff2]/30" : "bg-[#183234]/60"
                  }`}
                >
                  <span className="w-6 font-bold">{i + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-sm">{s.score || 0} pts</p>
                  </div>
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