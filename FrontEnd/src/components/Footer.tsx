import React from 'react'
import { FaCopyright } from 'react-icons/fa'
import { GiSnake } from 'react-icons/gi'
const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 pt-20" >

            <div className="max-w-[1200px] mx-auto">

                <div className="flex items-center justify-between pb-10">

                    <div className="">

                        <div className="flex items-center gap-3 mb-6">

                            <div className="bg-[#0ddff2] rounded-full flex items-center justify-center text-black p-1.5">

                                <GiSnake className="text-3xl" />
                            </div>

                            <h2 className="text-white text-xl font-bold tracking-tight uppercase">SLITHER UP</h2>

                        </div>

                        <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">

                            The world's premier competitive snake experience. Built for the community, powered by the grid.

                        </p>
                    </div>
                    <div className="pt-8 border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">

                        <p className="text-slate-600 text-sm flex items-center gap-1"><FaCopyright /> {new Date().getFullYear()} SLITHER UP Entertainment. All rights reserved.</p>

                    </div>
                </div>


            </div>

        </footer >

    )
}

export default Footer
