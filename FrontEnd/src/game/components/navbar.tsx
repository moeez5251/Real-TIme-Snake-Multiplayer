import React from 'react'

const Navbar = ({setShowHowToPlay}: {setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
     <header className="relative top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3">

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            Snake Arena 
          </h2>
         
        </div>
        <button
          onClick={() => setShowHowToPlay(true)}
          className="w-10 h-10 rounded-full bg-[#224649]/80 hover:bg-[#316368] flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110 shadow-md"
        >
          ?
        </button>
      </header>
  )
}

export default Navbar
