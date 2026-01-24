// src/components/Settings.tsx
import { motion } from 'framer-motion'
import { FaCog, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Aside from './aside'
import { useSound } from '../context/sound'
export default function Settings() {
  const [allsounds, setallsounds] = useState(true)
  const [Lobby, setLobby] = useState(false)
  const [other, setother] = useState(false)
  const { mute, toggleMute, stopSound, playSound } = useSound()
  
  useEffect(() => {
    if(mute){
    
      setallsounds(true)
    }
    else{
      setallsounds(false)
      playSound('lobby')
    }
    localStorage.setItem('mute', JSON.stringify(mute))
    return () => {

    }
  }, [mute])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-screen bg-[#f5f8f8] dark:bg-[#102122] text-slate-900 dark:text-white font-['Space_Grotesk']"
    >
      <div className="flex h-screen overflow-hidden">
        <Aside page="settings" />

        <main className="flex-1 flex flex-col overflow-y-auto p-8 gap-8 custom-scrollbar">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >


            <h1 className="text-4xl font-bold text-[#0ddff2] uppercase tracking-wider">
              Settings
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-100 dark:bg-[#1a2e30] rounded-xl p-8 border border-slate-200 dark:border-slate-700 mx-auto w-full"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaCog className="text-[#0ddff2] text-3xl" />
              General
            </h2>

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Sound</h3>
                  <p className="text-slate-500 my-2 dark:text-slate-400">
                    Mute or unmute the game music
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={toggleMute}
                  className={`relative w-16 h-8 flex items-center rounded-full transition-colors duration-300 ${!allsounds ? 'bg-[#0ddff2]' : 'bg-slate-400'
                    }`}
                >
                  <motion.div
                    className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center"
                    animate={{ x: !allsounds ? '2.1rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {allsounds ? (
                      <FaVolumeMute className="text-[#102122] text-sm" />
                    ) : (
                      <FaVolumeUp className="text-[#102122] text-sm" />
                    )}
                  </motion.div>
                </motion.button>
              </div>


            </div>
          </motion.div>
         
        </main>


      </div>
    </motion.div>
  )
}