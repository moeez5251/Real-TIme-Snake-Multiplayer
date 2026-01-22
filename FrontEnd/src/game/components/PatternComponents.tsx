import type { SnakeSkin } from "../types/game";

interface DrawPatternProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  cell: number;
  skin: SnakeSkin;
  isHead: boolean;
  boosting: boolean;
  dir?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  index?: number;
  length?: number;
}

/* ───────────────── CORE HELPERS ───────────────── */

const drawEyes = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: number,
  dir: DrawPatternProps["dir"]
) => {
  const offset = cell * 0.18;
  let ex1 = x + cell * 0.3;
  let ex2 = x + cell * 0.7;
  let ey = y + cell * 0.35;

  if (dir === "UP") ey -= offset;
  if (dir === "DOWN") ey += offset;
  if (dir === "LEFT") {
    ex1 -= offset;
    ex2 -= offset;
  }
  if (dir === "RIGHT") {
    ex1 += offset;
    ex2 += offset;
  }

  // white eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ex1, ey, cell * 0.12, 0, Math.PI * 2);
  ctx.arc(ex2, ey, cell * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // pupils
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(ex1, ey, cell * 0.05, 0, Math.PI * 2);
  ctx.arc(ex2, ey, cell * 0.05, 0, Math.PI * 2);
  ctx.fill();
};

const bodyScale = (index = 0, length = 10) =>
  Math.max(0.65, 1 - index / length);

/* ───────────────── SOLID (REALISTIC) ───────────────── */

export const SolidPattern = ({
  ctx,
  x,
  y,
  cell,
  skin,
  isHead,
  boosting,
  dir,
  index,
  length,
}: DrawPatternProps) => {
  const scale = isHead ? 1.1 : bodyScale(index, length);
  const size = cell * scale;
  const ox = x + (cell - size) / 2;
  const oy = y + (cell - size) / 2;

  ctx.fillStyle = isHead ? skin.head : skin.body;
  ctx.shadowColor = boosting ? "#0ff" : skin.body;
  ctx.shadowBlur = boosting ? 30 : 12;

  ctx.beginPath();
  ctx.roundRect(ox, oy, size, size, size * 0.45);
  ctx.fill();

  // subtle highlight
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(ox + size * 0.1, oy + size * 0.1, size * 0.5, size * 0.3, size * 0.3);
  ctx.fill();

  if (isHead) drawEyes(ctx, ox, oy, size, dir);

  ctx.shadowBlur = 0;
};

/* ───────────────── STRIPES (ORGANIC) ───────────────── */

export const StripesPattern = ({
  ctx,
  x,
  y,
  cell,
  skin,
  isHead,
  boosting,
  dir,
  index,
  length,
}: DrawPatternProps) => {
  const scale = isHead ? 1.1 : Math.max(0.65, 1 - (index ?? 0) / (length ?? 10));
  const size = cell * scale;
  const ox = x + (cell - size) / 2;
  const oy = y + (cell - size) / 2;

  // Base fill
  ctx.fillStyle = isHead ? skin.head : skin.body;
  ctx.shadowColor = boosting ? "#0ff" : skin.body;
  ctx.shadowBlur = boosting ? 25 : 10;
  ctx.fillRect(ox, oy, size, size);

  // 🔒 CLIP TO SEGMENT
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(ox, oy, size, size, size * 0.45);
  ctx.clip();

  // Stripes
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;

  const stripeGap = 6;
  for (let i = 0; i <= size * 2; i += stripeGap) {
    ctx.beginPath();
    ctx.moveTo(ox + i, oy);
    ctx.lineTo(ox + i - size, oy + size);
    ctx.stroke();
  }

  ctx.restore();

  if (isHead) drawEyes(ctx, ox, oy, size, dir);

  ctx.shadowBlur = 0;
};

/* ───────────────── DOTS (SCALES) ───────────────── */

export const DotsPattern = ({
  ctx,
  x,
  y,
  cell,
  skin,
  isHead,
  boosting,
  dir,
  index,
  length,
}: DrawPatternProps) => {
  const scale = isHead ? 1.1 : bodyScale(index, length);
  const size = cell * scale;
  const ox = x + (cell - size) / 2;
  const oy = y + (cell - size) / 2;

  ctx.fillStyle = isHead ? skin.head : skin.body;
  ctx.shadowColor = boosting ? "#0ff" : skin.body;
  ctx.shadowBlur = boosting ? 25 : 8;
  ctx.fillRect(ox, oy, size, size);

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  for (let i = 4; i < size; i += 8) {
    for (let j = 4; j < size; j += 8) {
      ctx.beginPath();
      ctx.arc(ox + i, oy + j, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (isHead) drawEyes(ctx, ox, oy, size, dir);
  ctx.shadowBlur = 0;
};

/* ───────────────── GLOW (ENERGY SNAKE) ───────────────── */

export const GlowPattern = ({
  ctx,
  x,
  y,
  cell,
  skin,
  isHead,
  boosting,
  dir,
  index,
  length,
}: DrawPatternProps) => {
  const scale = isHead ? 1.15 : bodyScale(index, length);
  const size = cell * scale;
  const ox = x + (cell - size) / 2;
  const oy = y + (cell - size) / 2;

  ctx.fillStyle = skin.body;
  ctx.shadowColor = skin.body;
  ctx.shadowBlur = boosting ? 35 : 18;
  ctx.fillRect(ox, oy, size, size);

  ctx.beginPath();
  ctx.arc(ox + size / 2, oy + size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fill();

  if (isHead) drawEyes(ctx, ox, oy, size, dir);
  ctx.shadowBlur = 0;
};
