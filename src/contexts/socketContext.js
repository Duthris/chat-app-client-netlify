import io from 'socket.io-client';
import { createContext } from 'react';


export const socket = io('https://duthris-chat-app.herokuapp.com', { transports: ['websocket'], upgrade: false });
export const SocketContext = createContext();

