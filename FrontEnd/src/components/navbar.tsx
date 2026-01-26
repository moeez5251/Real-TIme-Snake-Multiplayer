import { GiSnake } from 'react-icons/gi'
import { useSound } from '../context/sound'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const Navbar = () => {
    const { playSound } = useSound()
    const navigate = useNavigate()
    return (
        <div className='text-white w-[95%] mx-auto  pt-6 flex items-center justify-between relative z-10'>
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                    scale: 0.4,
                    opacity: 0,
                    transition: {
                        duration: 0.2,
                        ease: "easeIn"
                    }
                }}

                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => navigate("/")} className='flex items-center gap-1 cursor-pointer'>
                <div className='bg-[#0ddff2] w-10 h-10 rounded-full flex items-center justify-center '>
                    <GiSnake className='text-3xl text-[#102122]' />
                </div>
                <div className='font-semibold text-3xl'>
                    SLITHER UP
                </div>
            </motion.div>
            <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                    scale: 0.4,
                    opacity: 0,
                    transition: {
                        duration: 0.2,
                        ease: "easeIn"
                    }
                }}

                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => { playSound("click"); navigate("/verify") }}
                className="bg-[#0ddff2] text-[#102122] px-6 py-2.5 rounded-full text-base font-bold neon-glow hover:scale-105 transition-transform cursor-pointer"
            >
                Join Arena
            </motion.button>

        </div>
    )
}

export default Navbar
