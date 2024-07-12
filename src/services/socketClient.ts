import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000'); // Adjust the URL if your server is hosted elsewhere

export const joinRoom = (roomId: string): void => {
  socket.emit('joinRoom', roomId);
};

export const sendSketchData = (roomId: string, sketch: any): void => {
  socket.emit('sketchData', { roomId, sketch });
};

export const receiveSketchData = (callback: (sketch: any) => void): void => {
  socket.on('receiveSketchData', (sketch: any) => {
    callback(sketch);
  });
};
