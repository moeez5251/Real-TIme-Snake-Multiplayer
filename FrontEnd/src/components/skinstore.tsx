import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Aside from './aside'
import { SKINS } from './skins'
import { useSound } from '../context/sound'

export default function SkinStore() {
  const [equippedSkinId, setEquippedSkinId] = useState(1)
  const { playSound } = useSound()

  const handleEquip = (skinId: number) => {
    playSound("click")
    setEquippedSkinId(skinId)
    const oldSkin = JSON.parse(localStorage.getItem('equippedSkin')||'{}')
   localStorage.setItem('equippedSkin', JSON.stringify({
    ...oldSkin,
    color:SKINS.find((skin) => skin.id === skinId)?.color,
   }))
  }
  useEffect(() => {
    playSound("lobby")
    const skin = JSON.parse(localStorage.getItem('equippedSkin')||'{}') 
    if (skin) {
      const id=SKINS.find((sk) => sk.color === skin.color)?.id
      if(!id) return
      setEquippedSkinId(id)
    }
    else {
      localStorage.setItem('equippedSkin', JSON.stringify({
        color:SKINS[0].color,
        pattern:"Solid"
      }))
    }
    return () => {
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-screen bg-[#f5f8f8] dark:bg-[#102122] text-slate-900 dark:text-white font-['Space_Grotesk']"
    >
      <div className="flex h-screen overflow-hidden">
        <Aside page="skinstore" />

        <main className="flex-1 flex flex-col overflow-y-auto p-8 gap-8 custom-scrollbar">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >


            <h1 className="text-4xl font-bold text-[#0ddff2] uppercase tracking-wider">
              Skin Store
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3   gap-6"
          >
            {SKINS.map((skin) => {
              const isEquipped = equippedSkinId === skin.id

              return (
                <motion.div
                  key={skin.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: skin.id * 0.05, duration: 0.5 }}
                  className={`bg-slate-100 dark:bg-[#1a2e30] rounded-xl overflow-hidden border transition-all duration-300 group ${isEquipped
                    ? 'border-[#39ff14]/60 shadow-lg shadow-[#39ff14]/30'
                    : 'border-slate-700 hover:border-[#0ddff2]'
                    } hover:shadow-md hover:shadow-[#0ddff2]/20`}
                >
                  <div className="h-48 bg-[#102122] relative flex items-center justify-center p-6">
                    <div className="flex gap-2 items-end">
                      {[60, 50, 40, 30].map((size, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className="rounded-full border-2 border-white/20 neon-glow transition-all duration-300"
                          style={{
                            width: size,
                            height: size,
                            backgroundColor: skin.color,
                            opacity: 1 - i * 0.18,
                            boxShadow: isEquipped ? `0 0 25px ${skin.color}` : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{skin.name}</h3>
                      {isEquipped ? (
                        <span className="text-xs bg-[#39ff14]/30 text-[#39ff14] px-3 py-1 rounded-full font-bold border border-[#39ff14]/40">
                          EQUIPPED
                        </span>
                      ) : (
                        <span className="text-xs bg-[#0ddff2]/20 text-[#0ddff2] px-3 py-1 rounded-full font-bold border border-[#0ddff2]/30">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-400 mb-4">
                      {isEquipped ? 'Currently Equipped' : 'Exclusive Skin'}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleEquip(skin.id)}
                      disabled={isEquipped}
                      className={`w-full py-3 px-6 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${isEquipped
                        ? 'bg-[#39ff14]/30 text-[#39ff14] cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-[#0ddff2] to-[#00b7cc] text-[#102122] hover:from-[#39ff14] hover:to-[#2ecc10] hover:shadow-md hover:shadow-[#39ff14]/40'
                        }`}
                    >
                      {isEquipped ? 'EQUIPPED' : 'EQUIP NOW'}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </main>


      </div>
    </motion.div>
  )
}