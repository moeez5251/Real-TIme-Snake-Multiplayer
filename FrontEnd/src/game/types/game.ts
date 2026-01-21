export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type PatternType = "Solid" | "Stripes" | "Dots" | "Glow";
export interface Segment {
  x: number;
  y: number;
}

export type SkinPattern = "solid" | "stripes" | "dots" | "glow";

export interface SnakeSkin {
  head: string;
  body: string;
  pattern: PatternType;
}

export interface Snake {
  id: string;
  name: string;
  skin: SnakeSkin;
  direction: Direction;
  boost: boolean;
  stamina: number;
  score: number;
  body: Segment[];
  dead: boolean;
}

export interface GameState {
  snakes: Snake[];
  food: Segment;
  myId: string;
  width: number;
  height: number;
}
