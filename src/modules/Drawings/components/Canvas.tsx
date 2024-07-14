import { Theme, Tool } from '@enums';
import { useHistory, usePressedKeys } from '@hooks';
import useCanvasEvents from '@hooks/useCanvasEvents';
import { DynamicFeed, FormatColorFill, Redo, Undo } from '@mui/icons-material';
import { AppBar, Box, Button, ButtonGroup, IconButton, Popover, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ISketch } from '@stores';
import { ElementAttributes, ElementData } from '@types';
import { FocusEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { v4 as uuidv4 } from 'uuid';
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  cursorForPosition,
  defaultAttributes,
  drawElement,
  getElementAtPosition,
  resizedCoordinates,
} from '../utils';
import { CanvasMenu } from './CanvasMenu';
import { Header } from './Header';
import { Layers } from './Layers';
import { Panel } from './Panel';
import { Tools } from './Tools';

type Action = 'moving' | 'resizing' | 'drawing' | 'writing' | 'erasing' | 'panning' | 'none';

export const Canvas = ({ onClose, template }: { onClose: () => void; template: ISketch }) => {
  const theme = useTheme();
  const { elements, setElements, undo, redo, reset, removeById, changeDirection } = useHistory([...template.elements]);
  const pressedKeys = usePressedKeys();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('sm'));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [tool, setTool] = useState<Tool>(Tool.PENCIL);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [action, setAction] = useState<Action>('none');
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
  const [attributes, setAttributes] = useState<ElementAttributes>(defaultAttributes);
  const [popover, setPopover] = useState<'none' | 'layers' | 'panel'>('none');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openPanel = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopover('panel');
  };

  const openLayers = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopover('layers');
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopover('none');
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      // Draw elements in their original order
      if (action === 'writing' && selectedElement?.id === element.id) return;
      drawElement(roughCanvas, context, element);
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

  const updateElement = useCallback(
    (
      id: string,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      type: Tool,
      attributes: ElementAttributes,
      options?: { text?: string },
    ) => {
      const elementsCopy = [...elements];
      const elementIndex = elementsCopy.findIndex((element) => element.id === id);
      switch (type) {
        case Tool.LINE:
        case Tool.RECT:
        case Tool.CIRCLE:
          elementsCopy[elementIndex] = createElement(id, x1, y1, x2, y2, type, attributes);
          break;
        case Tool.PENCIL:
        case Tool.ERASER:
          elementsCopy[elementIndex].points = elementsCopy[elementIndex].points
            ? [...elementsCopy[elementIndex].points, { x: x2, y: y2 }]
            : [{ x: x2, y: y2 }];
          break;
        case Tool.TEXT:
          const canvas = canvasRef.current;
          if (!canvas) return;
          const context = canvas.getContext('2d');
          if (!context || !options?.text) return;
          const textWidth = context.measureText(options?.text).width;
          const textHeight = 24;
          elementsCopy[elementIndex] = {
            ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, attributes),
            text: options?.text,
          };
          break;
      }

      setElements(elementsCopy, true);
    },
    [elements, setElements],
  );

  const handleMouseDown = useCallback(
    (clientX: number, clientY: number) => {
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
          } else {
            setAction('resizing');
          }
        }
      } else {
        const element = createElement(uuidv4(), clientX, clientY, clientX, clientY, tool, attributes); // putting attributes while creating
        setElements((prevState) => [...prevState, element]); // Ensure new element is at the end of the array
        setSelectedElement(element);

        setAction(tool === Tool.TEXT ? 'writing' : 'drawing');
      }
    },
    [action, tool, pressedKeys, elements, attributes, setElements],
  );

  const handleMouseMove = useCallback(
    (clientX: number, clientY: number) => {
      if (action === 'panning') {
        const deltaX = clientX - startPanMousePosition.x;
        const deltaY = clientY - startPanMousePosition.y;
        setPanOffset({
          x: panOffset.x + deltaX,
          y: panOffset.y + deltaY,
        });
      } else if (action === 'moving') {
        if (!selectedElement) return;
        const { id, x1, x2, y1, y2, attributes, type, points, xOffsets, yOffsets, offsetX, offsetY } = selectedElement;
        if (type === Tool.PENCIL) {
          if (!points || !xOffsets || !yOffsets) return;
          const newPoints = points.map((_, index) => ({
            x: clientX - xOffsets[index],
            y: clientY - yOffsets[index],
          }));
          const elementIndex = elements.findIndex((element) => element.id === id);
          const elementsCopy = [...elements];
          elementsCopy[elementIndex] = {
            ...elementsCopy[elementIndex],
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
          updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, attributes, options);
        }
      } else if (action === 'drawing') {
        const index = elements.length - 1;
        const { x1, y1, attributes, id } = elements[index];
        updateElement(id, x1, y1, clientX, clientY, tool, attributes);
      } else if (action === 'erasing') {
        const element = getElementAtPosition(clientX, clientY, elements);
        if (element) removeById(element?.id);
      } else if (action === 'resizing') {
        if (!selectedElement) return;
        const { id, type, attributes, position, ...coordinates } = selectedElement;
        const elmData = resizedCoordinates(clientX, clientY, coordinates, position);
        if (!elmData) return;
        const { x1, y1, x2, y2 } = elmData;
        updateElement(id, x1, y1, x2, y2, type, attributes);
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
    },
    [action, tool, panOffset, startPanMousePosition, selectedElement, elements, setElements, removeById, updateElement],
  );

  const handleMouseUp = useCallback(
    (clientX: number, clientY: number) => {
      if (selectedElement) {
        const { offsetX, offsetY, x1, y1, type, id } = selectedElement;
        if (type === Tool.TEXT && offsetX && clientX - offsetX === x1 && offsetY && clientY - offsetY === y1) {
          setAction('writing');
          return;
        }
        const elementIndex = elements.findIndex((element) => element.id === selectedElement.id);
        const { type: elmType, attributes } = elements[elementIndex];
        if ((action === 'drawing' || action === 'resizing') && adjustmentRequired(elmType)) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[elementIndex]);
          updateElement(id, x1, y1, x2, y2, type, attributes);
        }
      }

      if (action === 'writing') return;

      if ([Tool.CIRCLE, Tool.RECT].includes(tool)) setTool(Tool.DEFAULT);
      setAction('none');
      setSelectedElement(null);
    },
    [selectedElement, elements, updateElement],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      setAction('none');
      if (selectedElement) {
        const { id, x1, y1, type, attributes } = selectedElement;
        updateElement(id, x1, y1, 0, 0, type, attributes, { text: event.currentTarget.value });
      }
      setSelectedElement(null);
    },
    [selectedElement, updateElement],
  );

  const exportToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return alert('Something went wrong');
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = template.title;

    // Append the anchor element to the body
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up: remove the anchor element from the body
    document.body.removeChild(downloadLink);
  };

  useCanvasEvents({
    canvasRef,
    panOffset,
    onDrawStart: handleMouseDown,
    onDrawing: handleMouseMove,
    onDrawEnd: handleMouseUp,
  });

  const handleSave = async (title?: string) => {
    await template.insertElements(elements, title);
  };

  return (
    <>
      <Header
        title={template.title}
        onClose={onClose}
        showWarn={JSON.stringify(elements) !== JSON.stringify(template.elements)}
        handleSave={handleSave}
      />
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          bgcolor: theme.palette.mode === Theme.LIGHT ? grey[100] : grey[800],
        }}
      >
        <CanvasMenu reset={reset} saveAsImage={exportToImage} handleSave={handleSave} />
        <Tools setTool={setTool} tool={tool} />
        {action === 'writing' && selectedElement ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: 'fixed',
              top: selectedElement.y1 - 2 + panOffset.y,
              left: selectedElement.x1 + panOffset.x,
              font: '24px sans-serif',
              color: selectedElement.attributes.strokeColor,
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
        <canvas id="canvas" ref={canvasRef} style={{ position: 'fixed', color: 'black' }} />
        {isLargeDevice ? (
          <>
            <Panel attributes={attributes} setAttributes={(a) => setAttributes(a)} />
            <Layers
              elements={elements}
              removeElement={removeById}
              selectedElement={selectedElement}
              changeDirection={changeDirection}
            />
            <ButtonGroup
              disableElevation
              variant="contained"
              size="small"
              color="inherit"
              aria-label="Disabled button group"
              sx={{ position: 'absolute', zIndex: 10, bottom: 16, left: 16 }}
            >
              <Button onClick={undo}>Undo</Button>
              <Button onClick={redo}>Redo</Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Popover
              id={popover}
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              PaperProps={{ sx: { bgcolor: 'transparent' } }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: popover === 'panel' ? 'right' : 'left',
              }}
            >
              {popover === 'panel' ? (
                <Panel attributes={attributes} setAttributes={(a) => setAttributes(a)} isPopover />
              ) : popover === 'layers' ? (
                <Layers
                  elements={elements}
                  removeElement={removeById}
                  selectedElement={selectedElement}
                  changeDirection={changeDirection}
                  isPopover
                />
              ) : null}
            </Popover>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
              <Toolbar>
                <IconButton onClick={openPanel} color="inherit" aria-label="open drawer">
                  <FormatColorFill />
                </IconButton>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <IconButton onClick={undo} color="inherit" aria-label="open drawer">
                    <Undo />
                  </IconButton>
                  <IconButton onClick={redo} color="inherit" aria-label="open drawer">
                    <Redo />
                  </IconButton>
                </Box>
                <IconButton onClick={openLayers} color="inherit">
                  <DynamicFeed />
                </IconButton>
              </Toolbar>
            </AppBar>
          </>
        )}
      </Box>
    </>
  );
};
