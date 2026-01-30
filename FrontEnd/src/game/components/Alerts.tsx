import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertsProps {
  alerts: string[];
}

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
  return (
    <div className="fixed bottom-6 right-0 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alerts.map((message, index) => (
          <motion.div
            key={message + index} 
            initial={{ 
              opacity: 0, 
              y: 20, 
              scale: 0.92,
              filter: "blur(4px)"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              filter: "blur(0px)",
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }
            }}
            exit={{ 
              opacity: 0, 
              y: -20, 
              scale: 0.88,
              filter: "blur(6px)",
              transition: { 
                duration: 0.35, 
                ease: [0.4, 0, 0.2, 1] 
              }
            }}
            layout
            className="
              bg-gradient-to-r from-[#1e3a4a] to-[#224649] 
              text-white 
              px-5 py-3 
              rounded-xl 
              shadow-[0_8px_32px_rgba(0,0,0,0.35)] 
              backdrop-blur-sm 
              border border-white/8 
              font-medium 
              text-xs
              sm:text-sm 
              tracking-tight 
              flex items-center gap-2.5
              min-w-fit
              sm:min-w-[220px]
              max-w-[380px]
            "
          >
            {/* Optional icon – you can customize per alert type later */}
            <svg 
              className="w-5 h-5 opacity-90 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>

            <span className="leading-tight">{message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;