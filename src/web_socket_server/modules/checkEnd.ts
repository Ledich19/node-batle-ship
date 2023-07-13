import { DAMAGE } from '../../app/variables.js';
import { wss } from '../../index.js';
import { users } from '../../data/users.js';
import { createResponse } from '../../app/healpers.js';
import { CustomWebSocket } from '../../app/types.js';

const checkEnd = (ws: CustomWebSocket, field: string[][], player: number) => {
  if (!field) {
    return;
  }
  const flatField = field.flat();
  const damagePoints = flatField.reduce((total, cell) => {
    if (cell === DAMAGE) {
      return total + 1;
    }
    return total;
  }, 0);

  
  if (damagePoints === 20) {
    users.setWinner(player);
    const winners = users.get().map((user) => ({ name: user.name, wins: user.wins }));
    ws.room.roomSockets.forEach((socket) => {
      socket.send(createResponse('finish', { winPlayer: player }));
    });
    wss.clients.forEach((client) => {
      client.send(createResponse('update_winners', winners));
    });
  }
};
export default checkEnd;
