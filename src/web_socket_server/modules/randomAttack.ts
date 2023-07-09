import WebSocket from 'ws';
import { users } from '../../data/users.js';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';

const randomAttack = (ws: WebSocket & { userId: number }, data: string) => {
  const userId = ws.userId;
  const user = users.getById(userId);
  const { indexRoom } = JSON.parse(data);

};
export default randomAttack;
