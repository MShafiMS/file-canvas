import { STROKE, Tool } from '@enums';
import { ElementAttributes, ElementData } from '@types';
import getStroke from 'perfect-freehand';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';

export const defaultAttributes: ElementAttributes = {
  strokeWidth: STROKE.REGULAR,
  strokeColor: '#000000',
  strokeStyle: 'solid',
  fillColor: '',
  opacity: 1,
};

export const strokeWidth = {
  [STROKE.THIN]: 1,
  [STROKE.REGULAR]: 3,
  [STROKE.BOLD]: 6,
};

export const createElement = (
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: Tool,
  attributes: ElementAttributes,
): ElementData => {
  const generator = rough.generator();
  let element;
  const options = {
    roughness: 0,
    stroke: attributes.strokeColor,
    strokeWidth: strokeWidth[attributes.strokeWidth],
    fill: attributes.fillColor,
    fillStyle: 'solid',
  };
  switch (type) {
    case Tool.RECT:
      element = generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      break;
    case Tool.CIRCLE:
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      element = generator.circle(x1, y1, radius * 2, options);
      break;
    case Tool.PENCIL:
      return { id, x1, y1, x2, y2, type, points: [{ x: x1, y: y1 }], attributes };
    case Tool.LINE:
      element = generator.line(x1, y1, x2, y2, options);
      break;
  }
  return { id, x1, y1, x2, y2, roughElement: element, type, attributes };
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
};

export const drawElement = (roughCanvas: RoughCanvas, context: CanvasRenderingContext2D, element: ElementData) => {
  switch (element.type) {
    case Tool.LINE:
    case Tool.RECT:
    case Tool.CIRCLE:
      if (element.roughElement) roughCanvas.draw(element.roughElement);
      break;
    case Tool.PENCIL:
      const penStroke = element.points
        ? getSvgPathFromStroke(getStroke(element.points, { size: strokeWidth[element.attributes.strokeWidth] * 4 }))
        : undefined;
      context.fillStyle = element.attributes.strokeColor;
      context.fill(new Path2D(penStroke));
      break;
    case Tool.ERASER:
      const stroke = element.points ? getSvgPathFromStroke(getStroke(element.points, { size: 16 })) : undefined;
      context.fill(new Path2D(stroke));
      break;
    case Tool.TEXT:
      context.textBaseline = 'top';
      context.font = '24px sans-serif';
      context.fillStyle = element.attributes.strokeColor;
      context.fillText(element.text || '', element.x1, element.y1);
      break;
  }
};

export const adjustmentRequired = (type: Tool) => [Tool.LINE, Tool.RECT].includes(type);

export const adjustElementCoordinates = (element: ElementData) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === Tool.RECT) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};
