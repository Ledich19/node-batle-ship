import WebSocket from 'ws';
import reg from './modules/reg.js';
import createRoom from './modules/create-room.js';
import addShips from './modules/add-ships.js';
import addUserToRoom from './modules/add-user-to-room.js';
import attack from './modules/attack.js';
import randomAttack from './modules/randomAttack.js';
import { CustomWebSocket } from '../app/types.js';
import singlePlay from './modules/singlePlay.js';

const handleWebSocket = (ws: WebSocket & { userId: number }) => {
  ws.on('error', console.error);
  ws.on('message', (data: string) => {
    const dataParsed = JSON.parse(data);
    console.log('TYPE:', dataParsed.type);
    const customWs = ws as CustomWebSocket;

    if (dataParsed.type === 'reg') {
      reg(ws, dataParsed.data);
    }
    if (dataParsed.type === 'create_room') {
      createRoom(customWs);
    }
    if (dataParsed.type === 'add_ships') {
      addShips(customWs, dataParsed.data);
    }
    if (dataParsed.type === 'add_user_to_room') {
      addUserToRoom(customWs, dataParsed.data);
    }
    if (dataParsed.type === 'attack') {
      attack(customWs, dataParsed.data);
    }
    if (dataParsed.type === 'randomAttack') {
      randomAttack(customWs, dataParsed.data);
    }
    if (dataParsed.type === 'single_play') {
      singlePlay(customWs);
    }
    console.log('received: %s', data);
  });

  ws.on('close', function handleClose() {
    console.log('--- WebSocket closed');
  });

  ws.on('error', function handleError(error) {
    console.error('WebSocket error:', error.message);
  });
};

export default handleWebSocket;
