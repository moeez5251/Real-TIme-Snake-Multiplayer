import type { SnakeSkin } from "../types/game";

interface DrawPatternProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  cell: number;
  skin: SnakeSkin;
  isHead: boolean;
  boosting: boolean;
}

export const SolidPattern = ({ ctx, x, y, cell, skin, isHead, boosting }: DrawPatternProps) => {
  ctx.fillStyle = isHead ? skin.head : skin.body;
  ctx.shadowColor = boosting ? "#0ff" : "#0ddff2";
  ctx.shadowBlur = boosting ? 30 : 12;
  ctx.beginPath();
  ctx.roundRect(x, y, cell, cell, cell * 0.3);
  ctx.fill();
  ctx.shadowBlur = 0;
};

export const StripesPattern = ({ ctx, x, y, cell, skin, isHead, boosting }: DrawPatternProps) => {
  const baseColor = isHead ? skin.head : skin.body;
  ctx.fillStyle = baseColor;
  ctx.shadowColor = boosting ? "#0ff" : "#0ddff2";
  ctx.shadowBlur = boosting ? 25 : 8;
  ctx.fillRect(x, y, cell, cell);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  for (let i = -cell; i < cell * 2; i += 6) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i - cell, y + cell);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
};

export const DotsPattern = ({ ctx, x, y, cell, skin, isHead, boosting }: DrawPatternProps) => {
  const baseColor = isHead ? skin.head : skin.body;
  ctx.fillStyle = baseColor;
  ctx.shadowColor = boosting ? "#0ff" : "#0ddff2";
  ctx.shadowBlur = boosting ? 25 : 8;
  ctx.fillRect(x, y, cell, cell);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  const dotSpacing = 6;
  const dotRadius = 1.5;
  for (let i = 0; i < cell; i += dotSpacing) {
    for (let j = 0; j < cell; j += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x + i, y + j, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;
};

export const GlowPattern = ({ ctx, x, y, cell, skin, isHead, boosting }: DrawPatternProps) => {
  const baseColor = isHead ? skin.head : skin.body;

  ctx.fillStyle = baseColor;
  ctx.shadowColor = baseColor;
  ctx.shadowBlur = boosting ? 30 : 15;
  ctx.fillRect(x, y, cell, cell);

  ctx.beginPath();
  ctx.arc(x + cell / 2, y + cell / 2, cell * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fill();
  ctx.shadowBlur = 0;
};
