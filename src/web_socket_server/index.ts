import WebSocket, { WebSocketServer } from 'ws';
import httpServer from '../http_server/index.js';

const handleWebSocket = (ws: WebSocket) => {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
};

export default handleWebSocket;
