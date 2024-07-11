import { Tool } from '@enums';
import { Drawable } from 'roughjs/bin/core';

export type Point = { x: number; y: number }[];

export type ElementData = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: Tool;
  roughElement?: Drawable;
  points?: Point;
  text?: string;
  xOffsets?: number[];
  yOffsets?: number[];
  offsetX?: number;
  offsetY?: number;
};
