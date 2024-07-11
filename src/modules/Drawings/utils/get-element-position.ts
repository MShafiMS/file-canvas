import { Tool } from '@enums';
import { ElementData } from '@types';

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const nearPoint = (x: number, y: number, x1: number, y1: number, name: string) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? 'inside' : null;
};

const positionWithinElement = (x: number, y: number, element: ElementData) => {
  const { type, points, x1, x2, y1, y2 } = element;
  switch (type) {
    case Tool.LINE:
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, 'start');
      const end = nearPoint(x, y, x2, y2, 'end');
      return start || end || on;
    case Tool.RECT:
      const topLeft = nearPoint(x, y, x1, y1, 'tl');
      const topRight = nearPoint(x, y, x2, y1, 'tr');
      const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      const bottomRight = nearPoint(x, y, x2, y2, 'br');
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case Tool.CIRCLE:
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const distanceFromCenter = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
      const insideCircle = distanceFromCenter <= radius;
      if (insideCircle) {
        const nearCenter = nearPoint(x, y, x1, y1, 'center');
        return nearCenter || 'inside';
      }
      break; // Add break statement to prevent fall-through
    case Tool.PENCIL:
      if (!points) return;
      const betweenAnyPoint = points.some((point, index) => {
        const nextPoint = points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
      });
      return betweenAnyPoint ? 'inside' : null;
    case Tool.TEXT:
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
  }
  return null;
};

export const getElementAtPosition = (x: number, y: number, elements: ElementData[]) => {
  return elements
    .map((element) => ({ ...element, position: positionWithinElement(x, y, element) }))
    .find((element) => element.position !== null);
};

export const cursorForPosition = (position: string) => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
      return 'nwse-resize';
    case 'tr':
    case 'bl':
      return 'nesw-resize';
    default:
      return 'move';
  }
};
