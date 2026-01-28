import { motion } from 'framer-motion'
import { FaCog, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import Aside from './aside'
import { useSound } from '../context/sound'
import { GiHamburgerMenu } from 'react-icons/gi'
export default function Settings() {
  const [allsounds, setallsounds] = useState(true)
  const { mute, toggleMute, playSound } = useSound()
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (mute) {

      setallsounds(true)
    }
    else {
      setallsounds(false)
      playSound('lobby')
    }
    localStorage.setItem('mute', JSON.stringify(mute))
    return () => {

    }
  }, [mute])
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        document.querySelector(".sidebar")
          ?.classList.add("-left-full")
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])
  const handlesidebar = () => {
    document.querySelector(".sidebar")?.classList.remove("-left-full")
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-screen bg-[#f5f8f8] dark:bg-[#102122] text-slate-900 dark:text-white font-['Space_Grotesk']"
    >
      <div className="flex h-screen overflow-hidden">
        <div ref={sidebarRef}>

          <Aside page="settings" />
        </div>
        <main className="flex-1 flex flex-col overflow-y-auto px-5 py-8 sm:p-8 gap-8 custom-scrollbar">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >

            <div className='flex flex-col gap-4'>
              <GiHamburgerMenu onClick={handlesidebar} className='text-3xl cursor-pointer md:hidden' />

              <h1 className="text-4xl font-bold text-[#0ddff2] uppercase tracking-wider">
                Settings
              </h1>
            </div>
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className={`relative w-16 h-8 p-1 flex items-center rounded-full transition-colors duration-300 ${!allsounds ? "bg-[#0ddff2]" : "bg-slate-400"
                    }`}
                >
                  <motion.div
                    layout
                    className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center"
                    style={{
                      marginLeft: !allsounds ? "auto" : "0px"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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