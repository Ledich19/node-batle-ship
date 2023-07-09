import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, SHIP } from '../../app/variables.js';
import { wss } from '../../index.js';
import { checkSurroundingCells } from '../../app/healpers.js';
import { users } from '../../data/users.js';
import { FieldType } from '../../app/types.js';

const checkEnd = (ws: WebSocket & { userId: number }, field: string[][], player: number) => {
  console.log("CHECK: ",player);
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
    const winnerObg = {
      type: 'finish',
      data: JSON.stringify({
        winPlayer: player,
      }),
      id: 0,
    };
console.log("WINNER: ",player);

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(winnerObg));
    });

    users.setWinner(player)
  }

};
export default checkEnd;
