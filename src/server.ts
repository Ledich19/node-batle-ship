import http from 'http';
import { WebSocketServer } from 'ws';
import handleHTTP from './http_server/index.js';
import handleWebSocket from './web_socket_server/index.js';
// const HTTP_PORT = 3000;

export const server = http.createServer(handleHTTP);
export const wss = new WebSocketServer({ server: server });
wss.on('connection', handleWebSocket);

server.on('upgrade', function upgrade() {
  console.log('--- upgrade:');
});

process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

