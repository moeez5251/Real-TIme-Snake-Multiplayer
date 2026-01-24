import { motion } from 'framer-motion'
import {
  FaPlay,
  FaPalette,
  FaNetworkWired,
  FaBolt,
} from 'react-icons/fa'
import {
  SolidPattern,
  StripesPattern,
  DotsPattern,
  GlowPattern,
} from './solidpatterns'
import { useEffect, useState } from 'react'
import Aside from './aside'
import GameLobby from './lobbyaside'
import { useSocket } from '../game/hooks/useSocket'
import ActiveRooms from './activerooms'
import { socket } from '../game/hooks/socket'
import { useNavigate } from "react-router";
import { GlowingEffect } from '../../components/ui/glowing-effect'
import { useSound } from '../context/sound'
const COLORS = ['#0ddff2', '#39ff14', '#ff00ff', '#ffff00', '#ff3131', '#ffffff']
const PATTERN_COMPONENTS = {
  Solid: SolidPattern,
  Stripes: StripesPattern,
  Dots: DotsPattern,
  Glow: GlowPattern,
}

type PatternType = keyof typeof PATTERN_COMPONENTS

export default function Lobby() {
  const navigate = useNavigate()
  const storedSkin = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('equippedSkin') || '{}')
    : {}

  const [selectedColor, setSelectedColor] = useState<string>(storedSkin.color || COLORS[0])
  const [selectedPattern, setSelectedPattern] = useState<PatternType>(storedSkin.pattern || 'Solid')
  const [allplayers, setallplayers] = useState([])
  const PatternComponent = PATTERN_COMPONENTS[selectedPattern]
  const { ping } = useSocket()
  const { playSound } = useSound()
  const handlejoinroom = () => {
    playSound("click")
    socket.emit("createRoom", () => { })
    socket.on("room-created", (data) => {
      navigate(`/room/${data.id}`)
    })
  }
  useEffect(() => {
    socket.on("players-updated", (players) => {
      setallplayers(players)
    })
    return () => {

    }
  }, [])
  useEffect(() => {
    localStorage.setItem("equippedSkin", JSON.stringify({
      color: selectedColor,
      pattern: selectedPattern
    }))

    return () => {

    }
  }, [selectedColor, selectedPattern])
  useEffect(() => {
    playSound("lobby")
    const equippedSkin = JSON.parse(localStorage.getItem("equippedSkin") || '{}')
    setSelectedColor(equippedSkin.color)
    setSelectedPattern(equippedSkin.pattern)
    return () => {
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f5f8f8] dark:bg-[#102122] text-slate-900 dark:text-white font-['Space_Grotesk']"
    >
      <div className="flex h-screen overflow-hidden">
        <Aside page="lobby" />

        <main className="flex-1 flex flex-col overflow-y-auto p-8 gap-8 custom-scrollbar">
          <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-[42px] font-bold leading-tight pb-2 pt-4 uppercase italic tracking-tight">
              Neon <span className="text-[#0ddff2]">Slither</span> UP
            </h1>
            <p className="text-slate-400 max-w-lg">
              Enter the grid, consume light, and become the longest serpent in the digital void.
            </p>
          </motion.header>

          <motion.section
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col items-center justify-center py-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#0ddff2] rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlejoinroom}
                className="relative flex min-w-70 items-center justify-center overflow-hidden rounded-full h-16 px-10 bg-[#0ddff2] text-[#102122] gap-3 text-xl font-bold shadow-lg shadow-[#0ddff2]/40"
              >
                <FaPlay className="text-2xl" />
                START NEW MATCH
              </motion.button>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex gap-6"
            >
              <div className="flex items-center gap-2 text-[#39ff14] font-medium">
                <span className="size-2 rounded-full bg-[#39ff14] animate-pulse" />
                <span>{allplayers.length} Players Online</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <FaBolt className="text-sm" />

                <span
                  className={`${ping < 50
                    ? "text-green-400"
                    : ping < 120
                      ? "text-yellow-400"
                      : "text-red-500"
                    }`}
                >
                  Ping: {ping} ms
                </span>
              </div>

            </motion.div>
          </motion.section>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-100 relative dark:bg-[#1a2e30] rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <GlowingEffect
                blur={0}
                borderWidth={2}
                spread={90}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <motion.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-[22px] font-bold pb-4 flex items-center gap-2"
              >
                <FaPalette className="text-[#0ddff2]" />
                Customize Your Snake
              </motion.h3>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className="w-full h-40 bg-[#102122] rounded-xl mb-6 relative overflow-hidden border border-slate-700 flex items-center justify-center"
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(#0ddff2 0.5px, transparent 0.5px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="flex gap-1 items-center">
                  {[64, 56, 48, 40, 32].map((size, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <PatternComponent color={selectedColor} size={size} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-widest">
                    Base Skin Color
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((color) => (
                      <motion.label
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.92 }}
                        className={`size-8 rounded-full border border-slate-500 cursor-pointer transition-all ${selectedColor === color ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-white' : ''
                          }`}
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="radio"
                          name="snake-color"
                          className="hidden"
                          checked={selectedColor === color}
                          onChange={() => {setSelectedColor(color); playSound('click');}}
                        />
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-widest">
                    Pattern
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {(['Solid', 'Stripes', 'Dots', 'Glow'] as const).map((pattern) => (
                      <motion.button
                        key={pattern}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {setSelectedPattern(pattern); playSound('click');}}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${selectedPattern === pattern
                          ? 'bg-[#102122] border-2 border-[#0ddff2] text-[#0ddff2] shadow-lg shadow-[#0ddff2]/30'
                          : 'bg-[#1a2e30] border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                          }`}
                      >
                        {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 relative dark:bg-[#1a2e30] rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col">
                <GlowingEffect
                  blur={0}
                  borderWidth={2}
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between items-center mb-4"
              >
              
                <h3 className="text-white text-[22px] font-bold flex items-center gap-2">
                  <FaNetworkWired className="text-[#0ddff2]" />
                  Active Game Rooms
                </h3>
                <span className="text-xs text-[#0ddff2] font-bold px-2 py-1 bg-[#0ddff2]/10 rounded">
                  LIVE
                </span>
              </motion.div>
              <ActiveRooms />

            </div>
          </motion.div>
        </main>

        <GameLobby />
      </div>
    </motion.div>
  )
}