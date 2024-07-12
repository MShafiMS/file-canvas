import { STROKE, Tool } from '@enums';
import { Drawable } from 'roughjs/bin/core';

export type Point = { x: number; y: number }[];

export type ElementAttributes = {
  strokeWidth: STROKE;
  strokeColor: string;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  fillColor: string;
  opacity?: number;
};

export type ElementData = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: Tool;
  attributes: ElementAttributes;
  roughElement?: Drawable;
  position?: string | null;
  points?: Point;
  text?: string;
  xOffsets?: number[];
  yOffsets?: number[];
  offsetX?: number;
  offsetY?: number;
};

export type Template = {
  _id: string;
  title: string;
  elements: ElementData[];
};
