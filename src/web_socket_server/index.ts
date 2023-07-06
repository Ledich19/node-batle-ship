import WebSocket, { WebSocketServer } from 'ws';
import httpServer from '../http_server/index.js';
import { RoomType, UserType } from '../types.js';
import reg from './modules/reg.js';
import createRoom from './modules/create_room.js';



const handleWebSocket = (ws: WebSocket & { userId: number }) => {
  ws.on('error', console.error);
  ws.on('message', (data: string) => {
    const dataParsed = JSON.parse(data);
    if (dataParsed.type === 'reg') {
     reg(ws, dataParsed.data)
    }
    if (dataParsed.type === 'create_room') {
      createRoom(ws, dataParsed.data)
    }
    if (dataParsed.type === 'add_ships') {
      console.log(dataParsed);
    }
    console.log('received: %s', data);
  });

  ws.send('something');
};

export default handleWebSocket;
