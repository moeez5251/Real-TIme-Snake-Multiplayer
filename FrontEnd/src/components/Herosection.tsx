import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useSound } from '../context/sound'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const Herosection = () => {
    const { playSound } = useSound()
    const navigate = useNavigate()
    return (
        <section className=" w-full overflow-hidden grid-bg">

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto relative z-10">

                <div className="flex flex-col items-center  text-center gap-2 py-8 md:py-16">

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

                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0ddff2]/20 border border-[#0ddff2]/40 text-[#0ddff2] text-xs font-bold tracking-widest uppercase mb-4">

                        <span className="relative flex h-2 w-2">

                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ddff2] opacity-75"></span>

                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ddff2]"></span>

                        </span>
                        Snake Arena


                    </motion.div>

                    <motion.h1
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
                        className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">

                        THE ULTIMATE <br />

                        <motion.span
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                            exit={{
                                scale: 0.4,
                                opacity: 0,
                                transition: {
                                    duration: 0.25,
                                    ease: "easeIn"
                                }
                            }}

                            className="inline-block
                            text-transparent bg-clip-text
                            bg-gradient-to-r from-[#0ddff2] to-[#a855f7]"
                        >
                            SLITHER SHOWDOWN
                        </motion.span>


                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                          exit={{
                                scale: 0.4,
                                opacity: 0,
                                transition: {
                                    duration: 0.25,
                                    ease: "easeIn"
                                }
                            }}
                        className="max-w-2xl text-lg text-slate-400 font-medium"
                    >


                        Experience the next generation of snake combat. Battle thousands of players worldwide in high-impact, real-time 60FPS digital arenas.

                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">

                        <motion.button
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={() => { playSound("click"); localStorage.getItem("username") ? navigate("/lobby") :    navigate("/verify") }} className="bg-[#0ddff2] text-background-dark text-xl font-black px-12 py-5 rounded-full neon-glow hover:scale-105 transition-transform flex items-center gap-3 cursor-pointer">

                            ENTER LOBBY
                            <FaArrowRight />

                        </motion.button>

                    </div>

                </div>




            </div>

        </section>
    )
}

export default Herosection
