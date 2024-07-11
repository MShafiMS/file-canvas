import { Tool } from '@enums';
import { useHistory, usePressedKeys } from '@hooks';
import useCanvasEvents from '@hooks/useCanvasEvents';
import { Box, InputBase } from '@mui/material';
import { ElementData } from '@types';
import getStroke from 'perfect-freehand';
import React, { FocusEvent, useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { cursorForPosition, getElementAtPosition } from '../utils';
import { Header } from './Header';
import { Tools } from './Tools';

const createElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: Tool): ElementData => {
  const generator = rough.generator();
  let element;
  switch (type) {
    case Tool.RECT:
      element = generator.rectangle(x1, y1, x2 - x1, y2 - y1, { roughness: 0 });
      break;
    case Tool.CIRCLE:
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      element = generator.circle(x1, y1, radius * 2, { roughness: 0 });
      break;
    case Tool.PENCIL:
      return { id, x1, y1, x2, y2, type, points: [{ x: x1, y: y1 }] };
    case Tool.LINE:
      element = generator.line(x1, y1, x2, y2, { roughness: 0 });
      break;
  }
  return { id, x1, y1, x2, y2, roughElement: element, type };
};

const getSvgPathFromStroke = (stroke: number[][]) => {
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

const drawElement = (
  roughCanvas: RoughCanvas,
  context: CanvasRenderingContext2D,
  element: ElementData,
  color: string,
) => {
  switch (element.type) {
    case Tool.LINE:
    case Tool.RECT:
    case Tool.CIRCLE:
      if (element.roughElement) roughCanvas.draw(element.roughElement);
      break;
    case Tool.PENCIL:
      const penStroke = element.points ? getSvgPathFromStroke(getStroke(element.points, { size: 4 })) : undefined;
      context.fillStyle = color;
      context.fill(new Path2D(penStroke));
      break;
    case Tool.ERASER:
      const stroke = element.points ? getSvgPathFromStroke(getStroke(element.points, { size: 16 })) : undefined;
      context.fill(new Path2D(stroke));
      break;
    case Tool.TEXT:
      context.textBaseline = 'top';
      context.font = '24px sans-serif';
      context.fillText(element.text || '', element.x1, element.y1);
      break;
  }
};

const adjustmentRequired = (type: Tool) => [Tool.LINE, Tool.RECT].includes(type);

const adjustElementCoordinates = (element: ElementData) => {
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

type Action = 'moving' | 'drawing' | 'writing' | 'erasing' | 'panning' | 'none';

export const Canvas = ({ onClose }: { onClose: () => void }) => {
  const { elements, setElements, undo, redo, reset, removeById } = useHistory([]);
  const pressedKeys = usePressedKeys();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [tool, setTool] = React.useState<Tool>(Tool.PENCIL);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [action, setAction] = useState<Action>('none');
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState('#000');

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      if (action === 'writing' && selectedElement?.id === element.id) return;
      drawElement(roughCanvas, context, element, color);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset]);

  useEffect(() => {
    const panFunction = (event: WheelEvent) => {
      setPanOffset((prevState) => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }));
    };

    document.addEventListener('wheel', panFunction);
    return () => {
      document.removeEventListener('wheel', panFunction);
    };
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === 'writing' && textArea) {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement?.text || '';
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: Tool,
    options?: { text?: string },
  ) => {
    const elementsCopy = [...elements];

    switch (type) {
      case Tool.LINE:
      case Tool.RECT:
      case Tool.CIRCLE:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case Tool.PENCIL:
      case Tool.ERASER:
        elementsCopy[id].points = elementsCopy[id].points
          ? [...elementsCopy[id].points, { x: x2, y: y2 }]
          : [{ x: x2, y: y2 }];
        break;
      case Tool.TEXT:
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context || !options?.text) return;
        const textWidth = context.measureText(options?.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options?.text,
        };
        break;
    }

    setElements(elementsCopy, true);
  };

  const handleMouseDown = (clientX: number, clientY: number) => {
    if (action === 'writing') return;
    if (tool === Tool.DRAG || pressedKeys.has(' ')) {
      setAction('panning');
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }
    if (tool === Tool.ERASER) {
      setAction('erasing');
    } else if (tool === Tool.DEFAULT) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const { type, points } = element;
        if (type === Tool.PENCIL) {
          if (!points) return;

          const xOffsets = points.map((point) => clientX - point.x);
          const yOffsets = points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === Tool.TEXT ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove = (clientX: number, clientY: number) => {
    if (action === 'panning') {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
    } else if (action === 'moving') {
      if (!selectedElement) return;
      const { id, x1, x2, y1, y2, type, points, xOffsets, yOffsets, offsetX, offsetY } = selectedElement;
      if (type === Tool.PENCIL) {
        if (!points || !xOffsets || !yOffsets) return;
        const newPoints = points.map((_, index) => ({
          x: clientX - xOffsets[index],
          y: clientY - yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[id] = {
          ...elementsCopy[id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        if (!offsetX || !offsetY) return;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options = type === Tool.TEXT ? { text: selectedElement.text } : {};
        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
      }
    } else if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === 'erasing') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) removeById(element?.id);
    }

    if ([Tool.DEFAULT, Tool.DRAG].includes(tool)) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const element = getElementAtPosition(clientX, clientY, elements);
      canvas.style.cursor =
        action === 'panning'
          ? 'grabbing'
          : tool === Tool.DRAG
          ? 'grab'
          : element?.position
          ? cursorForPosition(element.position)
          : 'default';
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.cursor = 'default';
    }
  };

  const handleMouseUp = (clientX: number, clientY: number) => {
    if (selectedElement) {
      const { offsetX, offsetY, x1, y1, type, id } = selectedElement;
      if (type === Tool.TEXT && offsetX && clientX - offsetX === x1 && offsetY && clientY - offsetY === y1) {
        setAction('writing');
        return;
      }

      const index = selectedElement.id;
      const { id: idx, type: elmType } = elements[index];
      if (action === 'drawing' && adjustmentRequired(elmType)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[idx]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);
  };

  useCanvasEvents(canvasRef, panOffset, handleMouseDown, handleMouseMove, handleMouseUp);

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setAction('none');
    if (selectedElement) {
      const { id, x1, y1, type } = selectedElement;
      updateElement(id, x1, y1, 0, 0, type, { text: event.currentTarget.value });
    }
    setSelectedElement(null);
  };

  const exportToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return alert('Something went wrong');
    const image = new Image();
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'fileName';

    // Append the anchor element to the body
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up: remove the anchor element from the body
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <Header onClose={onClose} undo={undo} redo={redo} reset={reset} save={exportToImage} />
      <Box>
        <Box sx={{ position: 'absolute', margin: 2, zIndex: 10 }}>
          <Tools setTool={setTool} tool={tool} />
          <InputBase type="color" onChange={(e) => setColor(e.currentTarget.value)} />
        </Box>
        {action === 'writing' && selectedElement ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: 'fixed',
              top: selectedElement.y1 - 2 + panOffset.y,
              left: selectedElement.x1 + panOffset.x,
              font: '24px sans-serif',
              margin: 0,
              padding: 0,
              border: 0,
              outline: 0,
              resize: 'none',
              overflow: 'hidden',
              whiteSpace: 'pre',
              background: 'transparent',
              zIndex: 2,
            }}
          />
        ) : null}
        <canvas
          id="canvas"
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ background: 'white', position: 'fixed', color: 'black' }}
          // onMouseDown={handleMouseDown}
          // onMouseMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
        />
      </Box>
    </>
  );
};
