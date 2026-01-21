import React from "react";

interface PatternProps {
  color: string;
  size: number;
}

export const SolidPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    className="rounded-full border-2 border-white/20 shadow-lg"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 20px ${color}, 0 0 10px ${color} 0`,
    }}
  />
);

export const StripesPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    className="rounded-full border-2 border-white/20 shadow-lg overflow-hidden relative"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
    }}
  >
    <div
      className="absolute inset-0 animate-stripes"
      style={{
        background: `repeating-linear-gradient(
          45deg,
          rgba(255,255,255,0.2),
          rgba(255,255,255,0.2) 4px,
          transparent 4px,
          transparent 8px
        )`,
      }}
    />
  </div>
);

export const DotsPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    className="rounded-full border-2 border-white/20 shadow-lg relative overflow-hidden"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
    }}
  >
    <div
      className="absolute inset-0 animate-dots"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2px)",
        backgroundSize: "10px 10px",
      }}
    />
  </div>
);

export const GlowPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    className="rounded-full border-2 border-white/20 relative flex items-center justify-center shadow-xl"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 40px ${color}, inset 0 0 20px ${color}`,
    }}
  >
    <div
      className="w-1/3 h-1/3 rounded-full bg-white/70 animate-pulse"
      style={{ boxShadow: `0 0 20px white` }}
    />
  </div>
);  