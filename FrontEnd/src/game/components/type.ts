export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Segment = { x: number; y: number };
export type Snake = {
  id: string;
  name: string;
  skin: { head?: string; body?: string };
  body: Segment[];
  direction: Direction;
  boost?: boolean;
  score?: number;
};
