import { motion } from "framer-motion";
import { FaInfoCircle, FaAppleAlt, FaBolt, FaSkull, FaQuestion } from "react-icons/fa";
import Popup from "../game/components/popup";
import { useState } from "react";
import { useSound } from "../context/sound";
import { RxCross1 } from "react-icons/rx";
const GameLobby: React.FC = () => {
  const [howtoPlay, setHowToPlay] = useState(false);
  const { playSound } = useSound();
  const tips = [
    { icon: <FaAppleAlt />, title: "Eat Food", description: "Collect apples to grow and gain points." },
    { icon: <FaBolt />, title: "Boost", description: "Hold SPACE to speed up, but watch your stamina!" },
    { icon: <FaSkull />, title: "Avoid Death", description: "Don't hit walls or other snakes." },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      exit={{x:1000}}
      className="w-80 shrink-0 bg-[#102122]/90 backdrop-blur-md border-r border-[#224649] xl:flex flex-col p-6 rounded-2xl shadow-lg overflow-hidden h-full absolute -left-full  xl:relative xl:left-0 transition-all infoaside"
    >
      <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2 tracking-tight uppercase">
        <FaInfoCircle className="text-[#0ddff2]" /> Game Lobby
        <RxCross1 onClick={()=>{document.querySelector(".infoaside")
          ?.classList.replace("left-[calc(100%-20rem)]", "-left-full");playSound("click")}} className="text-[#0ddff2] absolute right-2.5 cursor-pointer z-20" /> 

      </h3>

      <p className="text-slate-300 mb-6 text-sm leading-snug">
        Welcome to <span className="text-[#0ddff2] font-semibold">Snake Arena </span>! Learn the basics and get ready to dominate the grid.
      </p>

      <div className="flex flex-col gap-4">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-[#183234]/80 border border-[#316368] hover:bg-[#0ddff2]/10 transition"
          >
            <div className="text-[#0ddff2] text-lg">{tip.icon}</div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">{tip.title}</span>
              <span className="text-slate-400 text-xs">{tip.description}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-3 rounded-xl bg-[#183234]/80 border border-[#316368] hover:bg-[#0ddff2]/10 transition my-4"
      >
        <div className="text-[#0ddff2] text-lg"><FaQuestion /></div>
        <div className="flex flex-col">
          <span onClick={() => { setHowToPlay(true); playSound("click") }} className="text-white font-bold text-sm hover:text-[#0ddff2] cursor-pointer">How to Play</span>
          <span className="text-slate-400 text-xs">Read the rules and learn how to play.</span>
        </div>
      </motion.div>
      <div className="mt-auto pt-6 border-t border-[#224649]">
        <p className="text-slate-400 text-xs">
          Tip: Watch other players and predict their moves. Boost strategically!
        </p>
      </div>
      {
        howtoPlay &&
        <Popup setShowHowToPlay={setHowToPlay} />
      }
    </motion.aside>
  );
};

export default GameLobby;
