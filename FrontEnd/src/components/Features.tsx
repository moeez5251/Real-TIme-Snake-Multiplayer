import React from 'react'
import { BsFillLightningChargeFill } from "react-icons/bs"
import { MdOutlineFlare } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
const Features = () => {

    return (
        <section className="py-24 px-6 relative bg-black">

            <div className="max-w-[1200px] mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">

                    <div className="max-w-xl">

                        <h2 className="text-[#0ddff2] text-sm font-bold uppercase tracking-[0.3em] mb-4">Core Mechanics</h2>

                        <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">Dominate the Grid with Style</h3>

                    </div>

                    <p className="text-slate-400 max-w-sm">

                        Hone your skills and climb the ranks with tactical gameplay and unique visual upgrades.

                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-6">


                    <div className="group p-8 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#0ddff2]/50 transition-all duration-300">

                        <div className="size-14 rounded-full bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2] mb-6 group-hover:scale-110 transition-transform">
                        <BsFillLightningChargeFill  className="text-3xl "/>


                        </div>

                        <h4 className="text-xl font-bold text-white mb-3">Real-time Combat</h4>

                        <p className="text-slate-400 text-sm leading-relaxed">

                            Lag-free 60FPS action powered by our proprietary global network. Every pixel-perfect turn matters.

                        </p>

                    </div>


                    <div className="group p-8 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#a855f7]/50 transition-all duration-300">

                        <div className="size-14 rounded-full bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] mb-6 group-hover:scale-110 transition-transform">
                        <MdOutlineFlare className="text-3xl "/> 
                        </div>

                        <h4 className="text-xl font-bold text-white mb-3">Unique Power-ups</h4>

                        <p className="text-slate-400 text-sm leading-relaxed">

                            Deploy mass magnets, kinetic shields, and light-speed boosts to turn the tide of battle in seconds.

                        </p>

                    </div>


                    <div className="group p-8 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#0ddff2]/50 transition-all duration-300">

                        <div className="size-14 rounded-full bg-[#0ddff2]/10 flex items-center justify-center text-[#0ddff2] mb-6 group-hover:scale-110 transition-transform">
                            <IoIosColorPalette  className="text-3xl "/>

                        </div>

                        <h4 className="text-xl font-bold text-white mb-3">Custom Skins</h4>

                        <p className="text-slate-400 text-sm leading-relaxed">

                            Express yourself with thousands of neon trails, digital textures, and animated core patterns.

                        </p>

                    </div>

                </div>

            </div>

        </section>

    )
}

export default Features
