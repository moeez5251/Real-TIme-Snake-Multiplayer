import React from "react";

interface PatternProps {
  color: string;
  size: number;
}

/* ---------- SHARED STYLE ---------- */
const baseStyle: React.CSSProperties = {
  borderRadius: "9999px",
  border: "2px solid rgba(255,255,255,0.2)",
  overflow: "hidden",
  position: "relative",
};

/* ---------- SOLID ---------- */
export const SolidPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    style={{
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 20px ${color}`,
    }}
  />
);

/* ---------- STRIPES (FIXED RANGE) ---------- */
export const StripesPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    style={{
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.25) 0px,
            rgba(255,255,255,0.25) 6px,
            transparent 6px,
            transparent 12px
          )
        `,
        backgroundSize: "24px 24px",
        animation: "stripeMove 2s linear infinite",
      }}
    />

    <style>
      {`
        @keyframes stripeMove {
          from { background-position: 0 0; }
          to { background-position: 24px 24px; }
        }
      `}
    </style>
  </div>
);

/* ---------- DOTS ---------- */
export const DotsPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    style={{
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.6) 2px, transparent 2px)",
        backgroundSize: "10px 10px",
        animation: "dotFloat 3s linear infinite",
      }}
    />

    <style>
      {`
        @keyframes dotFloat {
          from { background-position: 0 0; }
          to { background-position: 20px 20px; }
        }
      `}
    </style>
  </div>
);

/* ---------- GLOW ---------- */
export const GlowPattern: React.FC<PatternProps> = ({ color, size }) => (
  <div
    style={{
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
      boxShadow: `0 0 40px ${color}, inset 0 0 20px ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: size / 3,
        height: size / 3,
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.8)",
        boxShadow: "0 0 20px white",
        animation: "pulseGlow 1.5s ease-in-out infinite",
      }}
    />

    <style>
      {`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}
    </style>
  </div>
);

/* ---------- OPTIONAL EXPORT MAP ---------- */
export const PatternMap = {
  solid: SolidPattern,
  stripes: StripesPattern,
  dots: DotsPattern,
  glow: GlowPattern,
};
