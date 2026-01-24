import { motion } from 'framer-motion'
import {
  FaHome,
  FaStore,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa'
import { GiSnake } from 'react-icons/gi'
import { usePage } from '../context/PageContext'
import { useSound } from '../context/sound'
const Aside = ({page}: {page: string}) => {
  const { setCurrentPage } = usePage()
  const { playSound } = useSound()
  return (
     <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-72 shrink-0 bg-[#f5f8f8] dark:bg-[#102122] border-r border-slate-200 dark:border-slate-800 flex flex-col p-6"
        >
          <div onClick={()=>setCurrentPage("lobby")} className="flex items-center gap-3 mb-10 cursor-pointer">
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

          <nav className="flex flex-col gap-2 flex-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={()=>{setCurrentPage("lobby"); playSound('click')}}
              className={`${page==="lobby"?"flex items-center gap-4 px-4 py-3 rounded-full bg-[#0ddff2] text-[#102122] font-bold cursor-pointer":"flex items-center gap-4 px-4 py-3 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a2e30] transition-colors cursor-pointer text-slate-600 dark:text-slate-300"} `}
            >
              <FaHome />
              <span>Home</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {setCurrentPage('skinstore'); playSound('click')}}
              className={`${page==="skinstore"?"flex items-center gap-4 px-4 py-3 rounded-full bg-[#0ddff2] text-[#102122] font-bold cursor-pointer":"flex items-center gap-4 px-4 py-3 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a2e30] transition-colors cursor-pointer text-slate-600 dark:text-slate-300"} `}
            >
              <FaStore />
              <span>Skin Store</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {setCurrentPage('settings'); playSound('click')}}
              className={`${page==="settings"?"flex items-center gap-4 px-4 py-3 rounded-full bg-[#0ddff2] text-[#102122] font-bold cursor-pointer":"flex items-center gap-4 px-4 py-3 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a2e30] transition-colors cursor-pointer text-slate-600 dark:text-slate-300"} `}
            >
              <FaCog />
              <span>Settings</span>
            </motion.button>
          </nav>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-auto p-4 rounded-xl bg-slate-100 dark:bg-[#1a2e30] flex items-center gap-3 border border-slate-200 dark:border-slate-700"
          >
            <div
              className="size-10 rounded-full bg-cover bg-center border-2 border-[#0ddff2]"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100")',
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate">CyberSnake_99</span>
              <span className="text-xs text-[#0ddff2] font-medium">Lv. 24 Platinum</span>
            </div>
            <FaSignOutAlt className="ml-auto text-slate-400 text-lg" />
          </motion.div>
        </motion.aside>
  )
}

export default Aside
