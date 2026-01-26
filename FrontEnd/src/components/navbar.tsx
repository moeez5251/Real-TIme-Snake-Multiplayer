import { GiSnake } from 'react-icons/gi'
import { useSound } from '../context/sound'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const { playSound } = useSound()
    const navigate = useNavigate()
    return (
        <div className='text-white w-[95%] mx-auto  pt-6 flex items-center justify-between relative z-10'>
            <div onClick={()=>navigate("/")} className='flex items-center gap-1 cursor-pointer'>
                <div  className='bg-[#0ddff2] w-10 h-10 rounded-full flex items-center justify-center '>
                    <GiSnake className='text-3xl text-[#102122]' />
                </div>
                <div className='font-semibold text-3xl'>
                    SLITHER UP
                </div>
            </div>
            <button
                onClick={() => { playSound("click");navigate("/lobby") }}
                className="bg-[#0ddff2] text-[#102122] px-6 py-2.5 rounded-full text-base font-bold neon-glow hover:scale-105 transition-transform cursor-pointer"
            >
                Join Arena
            </button>

        </div>
    )
}

export default Navbar
