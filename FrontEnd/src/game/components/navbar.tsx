import React from 'react'
import { motion } from 'framer-motion'
import { GiSnake } from 'react-icons/gi'
const Navbar = ({setShowHowToPlay}: {setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
     <header className="relative top-0 left-0 right-0 z-40 flex items-start justify-between px-6 py-3">

       <div  className="flex items-center gap-3 mb-10 cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.12, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="size-12 rounded-full bg-[#0ddff2] flex items-center justify-center neon-glow"
            >
              <GiSnake className="text-[#102122] text-3xl" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0ddff2]">SLITHER.UP</h2>
              <p className="text-xs text-slate-500 dark:text-[#90c6cb] uppercase tracking-widest font-bold">
                Multiplayer
              </p>
            </div>
          </div>
        <button
          onClick={() => setShowHowToPlay(true)}
          className="w-10 h-10 rounded-full bg-[#224649]/80 hover:bg-[#316368] flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110 shadow-md"
        >
          ?
        </button>
      </header>
  )
}

export default Navbar
