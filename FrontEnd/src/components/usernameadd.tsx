import { useEffect, useState } from 'react'
import { BackgroundRippleEffect } from './GridDemoBg'
import { FaVolumeMute } from 'react-icons/fa'
import { FaVolumeHigh } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { GiSnake } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useSound } from '../context/sound';
import Loader from './loader';
const UserName = () => {
    const navigate = useNavigate()
    const { stopSound,toggleMute,playSound } = useSound()
    const [mutechecker, setmutechecker] = useState(false)
    const [name, setName] = useState("")
    const [load, setLoad] = useState(false)
    const handlehighvolume = () => {
        setmutechecker(true)
        toggleMute()
        playSound("click")
        localStorage.setItem('mute', JSON.stringify(true))
    }
    const handleclick = () => {
        setLoad(true)
        localStorage.setItem('username', JSON.stringify(name))
        playSound("click")
        navigate('/lobby')
    }
    useEffect(() => {
        stopSound('lobby')
        const mute = JSON.parse(localStorage.getItem('mute') || 'false')
        if (mute) {
            setmutechecker(true)
        }

        return () => {

        }
    }, [])
    useEffect(() => {
        window.addEventListener("keydown", e => {
            if (e.key === "Enter" && name.length > 0) {
                handleclick()
            }
        })

        return () => {
            window.removeEventListener("keydown", e => {
                if (e.key === "Enter" && name.length > 0) {
                    handleclick()
                }
            })
        }
    }, [name])

    return (
        <div className='overflow-hidden bg-black '>

            <BackgroundRippleEffect rows={11} />
            <div className='relative z-20 m-4 flex items-center justify-center h-screen'>
                <motion.div
                    initial={{ scale: 0.3 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    exit={{
                        scale: 0.4,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn"
                        }
                    }}
                    className='text-black text-right float-right bg-white p-3 rounded-full absolute right-0 top-0'>
                    {
                        !mutechecker &&
                        <FaVolumeHigh onClick={handlehighvolume} className='text-2xl cursor-pointer' />
                    }
                    {
                        mutechecker &&
                        <FaVolumeMute onClick={() => { setmutechecker(false); localStorage.setItem('mute', JSON.stringify(false)); toggleMute();playSound("click") }} className='text-2xl cursor-pointer' />
                    }

                </motion.div>
                <motion.div
                    initial={{ scale: 0.3 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    exit={{
                        scale: 0.4,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn"
                        }
                    }}
                    className='text-black text-right float-right bg-white p-2 rounded-full absolute left-0 top-0'>
                    <IoIosArrowBack onClick={() => navigate('/')} className='text-2xl cursor-pointer' />

                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    exit={{
                        scale: 0.4,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn"
                        }
                    }}
                    className="
                    bg-white/85
                    sm:w-1/3
                    mx-auto
                    px-10
                    py-8
                    rounded-lg
                    "
                >

                    <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GiSnake className="text-3xl text-white" />
                    </div>

                    <h1 className="text-black text-center text-3xl font-bold mb-6">
                        Enter Your Name
                    </h1>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Player name..."
                        autoFocus
                        className="
                            w-full
                            bg-transparent
                            border
                            border-black/50
                            rounded-md
                            px-4
                            py-2
                            text-black
                            outline-none
                            mb-5
                            placeholder:text-black/40
                            focus:border-black
                            "
                    />

                    <button
                        disabled={!name}
                        onClick={handleclick}
                            className="
                                w-full
                                border
                                cursor-pointer
                                border-black
                                text-black
                                py-2
                                rounded-md
                                font-medium
                                hover:bg-black
                                hover:text-white
                                transition
                                disabled:bg-black/10
                                disabled:pointer-events-none
                                disabled:cursor-auto
                                "
                    >
                        Confirm
                    </button>

                </motion.div>
                {
                    load &&
                    <Loader text="Joining..." color="#0ddff2" />
                }

            </div>
        </div>
    )
}

export default UserName
