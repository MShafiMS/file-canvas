import { Box } from '@mui/material';
import React from 'react';

export type Shape = 'freehand' | 'line' | 'rectangle' | 'circle' | 'eraser';

interface Point {
  x: number;
  y: number;
}

interface DrawingAction {
  type: Shape;
  start: Point;
  end?: Point;
  color?: string;
  lineWidth?: number;
}

export const Canvas2: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [shape, setShape] = React.useState<Shape>('freehand');
  const [actions, setActions] = React.useState<DrawingAction[]>([]);
  const [redoStack, setRedoStack] = React.useState<DrawingAction[]>([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      if (['freehand', 'eraser'].includes(shape)) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
      }
      const action: DrawingAction = {
        type: shape,
        start: { x: offsetX, y: offsetY },
        color: contextRef.current.strokeStyle as string,
        lineWidth: contextRef.current.lineWidth,
      };
      setActions((prevActions) => [...prevActions, action]);
    }
    setIsDrawing(true);
  };

  const finishDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (!isDrawing || !contextRef.current) return;
    if (['freehand', 'eraser'].includes(shape)) contextRef.current.closePath();
    const currentAction = actions[actions.length - 1];
    const updatedAction = { ...currentAction, end: { x: offsetX, y: offsetY } };
    setActions((prevActions) => [...prevActions.slice(0, -1), updatedAction]);
    setIsDrawing(false);
    if (!['freehand', 'eraser'].includes(shape)) redrawCanvas();
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = nativeEvent;
    const currentAction = actions[actions.length - 1];

    const context = contextRef.current;
    if (!['freehand', 'eraser'].includes(shape)) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      redrawCanvas(); // Clear the canvas and redraw previous actions
    }
    if (currentAction.type === 'freehand' || currentAction.type === 'eraser') {
      context.strokeStyle = currentAction.type === 'eraser' ? 'white' : (currentAction.color as string);
      context.lineWidth = currentAction.type === 'eraser' ? 10 : (currentAction.lineWidth as number);

      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (currentAction.type === 'line') {
      context.strokeStyle = currentAction.color as string;
      context.lineWidth = currentAction.lineWidth as number;
      if (currentAction.end) {
        context.beginPath();
        context.moveTo(currentAction.start.x, currentAction.start.y);
        context.lineTo(currentAction.end.x, currentAction.end.y);
        context.stroke();
        context.closePath();
      }
    } else if (currentAction.type === 'rectangle') {
      context.strokeStyle = currentAction.color as string;
      context.lineWidth = currentAction.lineWidth as number;
      context.strokeRect(
        currentAction.start.x,
        currentAction.start.y,
        offsetX - currentAction.start.x,
        offsetY - currentAction.start.y,
      );
    } else if (currentAction.type === 'circle') {
      context.strokeStyle = currentAction.color as string;
      context.lineWidth = currentAction.lineWidth as number;
      const radius = Math.sqrt(
        Math.pow(offsetX - currentAction.start.x, 2) + Math.pow(offsetY - currentAction.start.y, 2),
      );
      context.beginPath();
      context.arc(currentAction.start.x, currentAction.start.y, radius, 0, Math.PI * 2);
      context.stroke();
      context.closePath();
    }
    const updatedAction = { ...currentAction, end: { x: offsetX, y: offsetY } };
    setActions((prevActions) => [...prevActions.slice(0, -1), updatedAction]);
  };

  const undo = () => {
    if (actions.length === 0) return;
    const lastAction = actions[actions.length - 1];
    setRedoStack((prevRedoStack) => [...prevRedoStack, lastAction]);
    setActions((prevActions) => prevActions.slice(0, -1));
    redrawCanvas();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastRedoAction = redoStack[redoStack.length - 1];
    setActions((prevActions) => [...prevActions, lastRedoAction]);
    setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
    redrawCanvas();
  };

  const redrawCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const context = contextRef.current;
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    actions.forEach((action) => {
      if (action.type === 'line') {
        context.strokeStyle = action.color as string;
        context.lineWidth = action.lineWidth as number;
        context.beginPath();
        context.moveTo(action.start.x, action.start.y);
        if (action.end) {
          context.lineTo(action.end.x, action.end.y);
        }
        context.stroke();
        context.closePath();
      } else if (action.type === 'rectangle') {
        context.strokeStyle = action.color as string;
        context.lineWidth = action.lineWidth as number;
        context.strokeRect(
          action.start.x,
          action.start.y,
          (action.end?.x as number) - action.start.x,
          (action.end?.y as number) - action.start.y,
        );
      } else if (action.type === 'circle') {
        context.strokeStyle = action.color as string;
        context.lineWidth = action.lineWidth as number;
        const radius = Math.sqrt(
          Math.pow((action.end?.x as number) - action.start.x, 2) +
            Math.pow((action.end?.y as number) - action.start.y, 2),
        );
        context.beginPath();
        context.arc(action.start.x, action.start.y, radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();
      }
    });
  };

  return (
    <Box>
      <Box sx={{ position: 'absolute', margin: 2, zIndex: 10 }}>
        {/* <Tools setShape={setShape} shape={shape} /> */}
      </Box>
      <canvas
        ref={canvasRef}
        style={{ background: 'white', position: 'fixed' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
      />
    </Box>
  );
};
