import { Server } from 'socket.io';

let io = null;

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' }, // adjust this for your frontend origin if needed
  });

  io.on('connection', (socket) => {
    console.log('Frontend connected to Socket.IO');
  });
}

export function emitEmployeeEvent(event) {
  if (io) {
    io.emit('employee-update', event);
    console.log('Event emitted to frontend:', event);
  }
}
