import WebSocket from 'ws';
import { DAMAGE } from '../../app/variables.js';
import { wss } from '../../index.js';
import { users } from '../../data/users.js';
import { createResponse } from '../../app/healpers.js';

const checkEnd = (ws: WebSocket & { userId: number }, field: string[][], player: number) => {
  console.log('CHECK: ', player);
  console.log('ADD_SHIPS:');
  field.forEach((element) => {
    console.log(element.toString());
  });

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
    wss.clients.forEach((client) => {
      client.send(createResponse('finish', { winPlayer: player }));
    });
    users.setWinner(player);
  }
};
export default checkEnd;
