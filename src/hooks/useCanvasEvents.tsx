import { RefObject, useEffect } from 'react';

const useCanvasEvents = (
  canvasRef: RefObject<HTMLCanvasElement>,
  panOffset: { x: number; y: number },
  onDrawStart: (x: number, y: number) => void,
  onDrawing: (x: number, y: number) => void,
  onDrawEnd: (x: number, y: number) => void,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getMouseCoordinates = (
      event: MouseEvent | TouchEvent,
      panOffset: { x: number; y: number },
    ): { clientX: number; clientY: number } => {
      let clientX = 0;
      let clientY = 0;

      if (event instanceof MouseEvent) {
        clientX = event.offsetX - panOffset.x;
        clientY = event.offsetY - panOffset.y;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        if (touch) {
          const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
          clientX = touch.clientX - rect.left - panOffset.x;
          clientY = touch.clientY - rect.top - panOffset.y;
        }
      }

      return { clientX, clientY };
    };

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const { clientX, clientY } = getMouseCoordinates(event, panOffset);
      onDrawStart(clientX, clientY);
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const { clientX, clientY } = getMouseCoordinates(event, panOffset);
      onDrawing(clientX, clientY);
    };

    const stopDrawing = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const { clientX, clientY } = getMouseCoordinates(event, panOffset);
      onDrawEnd(clientX, clientY);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [canvasRef, onDrawStart, onDrawing, onDrawEnd, panOffset]);
};

export default useCanvasEvents;
