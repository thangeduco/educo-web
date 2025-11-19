// socketClient.ts
import { io } from 'socket.io-client';

const socket = io(
  process.env.REACT_APP_SOCKET_URL || 'http://localhost:3100',
  {
    transports: ['websocket'],
    autoConnect: true,
  }
);

export default socket;
