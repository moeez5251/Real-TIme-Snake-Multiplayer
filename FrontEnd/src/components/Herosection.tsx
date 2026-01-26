import React from 'react'
import {  FaArrowRight } from 'react-icons/fa'
import { useSound } from '../context/sound'
import { useNavigate } from 'react-router-dom'
const Herosection = () => {
    const { playSound } = useSound()
    const navigate = useNavigate()
    return (
        <section className=" w-full overflow-hidden grid-bg">

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto relative z-10">

                <div className="flex flex-col items-center  text-center gap-2 py-8 md:py-16">

                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0ddff2]/20 border border-[#0ddff2]/40 text-[#0ddff2] text-xs font-bold tracking-widest uppercase mb-4">

                        <span className="relative flex h-2 w-2">

                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ddff2] opacity-75"></span>

                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ddff2]"></span>

                        </span>
                        Snake Arena
                       

                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">

                        THE ULTIMATE <br />

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ddff2] to-[#a855f7]">SLITHER SHOWDOWN</span>

                    </h1>

                    <p className="max-w-2xl text-lg text-slate-400 font-medium">

                        Experience the next generation of snake combat. Battle thousands of players worldwide in high-impact, real-time 60FPS digital arenas.

                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">

                        <button onClick={()=>{playSound("click");navigate("/lobby")}} className="bg-[#0ddff2] text-background-dark text-xl font-black px-12 py-5 rounded-full neon-glow hover:scale-105 transition-transform flex items-center gap-3 cursor-pointer">

                            ENTER LOBBY
                            <FaArrowRight />

                        </button>

                    </div>

                </div>




            </div>

        </section>
    )
}

export default Herosection
