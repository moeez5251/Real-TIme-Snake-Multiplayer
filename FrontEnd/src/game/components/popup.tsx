import React from "react";
import { FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaSpaceShuttle, FaAppleAlt, FaSkullCrossbones } from "react-icons/fa";
import useIsMobile from "../hooks/isinmobile";
interface PopupProps {
  setShowHowToPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({ setShowHowToPlay }) => {
  const isMobile = useIsMobile({width:1300});
  return (
    <div className="fixed inset-0 z-52 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="relative bg-[#102122] border border-[#224649] rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setShowHowToPlay(false)}
          className="absolute top-4 right-5 text-3xl text-[#0ddff2] hover:text-white transition"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-8 text-[#0ddff2] tracking-wide">
          How to Play
        </h2>

        <div className="space-y-6 text-md text-white">
          {/* Movement */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center text-2xl text-[#0ddff2] font-bold">
              <FiArrowUp />
              <FiArrowDown />
              <FiArrowLeft />
              <FiArrowRight />
            </div>
            {
              isMobile ?
              <p className="text-[#c0e8f0] text-left">Swipe to move your snake</p> :
              <p className="text-[#c0e8f0] text-left">or WASD to move your snake</p>
            }
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-2xl text-[#0ddff2] font-bold">
              <FaSpaceShuttle />
            </div>
            {
              isMobile ?
              <p className="text-[#c0e8f0] text-left">Double tap your snake to boost (consumes stamina)</p> :
              <p className="text-[#c0e8f0] text-left">Hold SPACE to boost (consumes stamina)</p>
            }
          </div>

          {/* Food */}
          <div className="flex items-center justify-between">
            <div className="text-2xl text-[#ffdd57]">
              <FaAppleAlt />
            </div>
            <p className="text-[#c0e8f0] text-left">Eat food to grow & gain score</p>
          </div>

          {/* Danger */}
          <div className="flex items-center justify-between">
            <div className="text-2xl text-red-500">
              <FaSkullCrossbones />
            </div>
            <p className="text-[#c0e8f0] text-left">Avoid walls & other snakes</p>
          </div>
        </div>

        {/* Got it button */}
        <button
          onClick={() => setShowHowToPlay(false)}
          className="mt-8 w-full py-4 bg-linear-to-r from-[#0ddff2] to-white rounded-2xl font-bold text-xl text-black hover:scale-105 transition-transform shadow-lg"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default Popup;
