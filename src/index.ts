import http from 'http';
import { WebSocketServer } from 'ws';
import handleHTTP from './http_server/index.js';
import handleWebSocket from './web_socket_server/index.js';
// const HTTP_PORT = 3000;

export const server = http.createServer(handleHTTP);
export const wss = new WebSocketServer({ server: server });
wss.on('connection', handleWebSocket);

server.on('upgrade', function upgrade(request, socket, head) {
  console.log('--- upgrade:');
});

// console.log(`Start static http server on the ${HTTP_PORT} port!`);
// server.listen(HTTP_PORT);

