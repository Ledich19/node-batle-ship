import { DAMAGE, SHIP_POINTS } from '../../app/variables.js';
import { users } from '../../data/users.js';
import { createResponse } from '../helpers/responses.js';
import { CustomWebSocket } from '../../app/types.js';
import { rooms } from '../../data/rooms.js';
import { updateRoomsAndWinnersForAll } from '../helpers/responses.js';

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

  if (damagePoints === SHIP_POINTS) {
    users.setWinner(player);
    rooms.remove(ws.room.roomId);
    updateRoomsAndWinnersForAll()

    ws.room.roomSockets.forEach((socket) => {
      socket.send(createResponse('finish', { winPlayer: player }));
    });
  }
};
export default checkEnd;
