import React from 'react'
import { FaRankingStar } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
const Control = ({ leaderboardstate,hudestate }: { leaderboardstate: React.Dispatch<React.SetStateAction<boolean>> , hudestate: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <>
            <div className='flex items-start justify-between relative z-40 top-[65%]'>

                <div onClick={() => hudestate(true)} className='w-10 h-10 rounded-full bg-[#224649]/80 hover:bg-[#316368] flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110 shadow-md mx-7'>
                    <FaInfo />
                </div>
                <div onClick={() => leaderboardstate(true)} className='w-10 h-10 rounded-full bg-[#224649]/80 hover:bg-[#316368] flex items-center justify-center text-white text-xl font-bold transition-all hover:scale-110 shadow-md mx-7'>
                    <FaRankingStar  />
                </div>
            </div>
        </>
    )
}

export default Control