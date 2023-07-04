import http from 'http';
import { WebSocketServer } from 'ws';
import serverWithSocket from "./src/web_socket_server/index.js"
import handleHTTP from './src/http_server/index.js';
import handleWebSocket from './src/web_socket_server/index.js';
const HTTP_PORT = 3000;

const server = http.createServer(handleHTTP);
const wss = new WebSocketServer({ server: server });
wss.on('connection', handleWebSocket);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
server.listen(HTTP_PORT);
