import { CustomWebSocket, ShipType } from '../../app/types.js';

import { SEA, SHIP } from '../../app/variables.js';
import { createResponse } from '../../app/healpers.js';
import { rooms } from '../../data/rooms.js';

const addShips = (ws: CustomWebSocket, data: string) => {
  const FiELD_SIZE = 10;
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const room = rooms.getById(gameId);
  if (!room) {
    return
  }

  const field = Array(FiELD_SIZE)
    .fill(SEA)
    .map(() => Array(FiELD_SIZE).fill(SEA));

  ships.forEach((ship: ShipType) => {
    const { position, direction, length } = ship;
    for (let i = 0; i < length; i++) {
      if (direction) {
        field[position.y + i][position.x] = SHIP;
      } else {
        field[position.y][position.x + i] = SHIP;
      }
    }
  });
  room.fields[indexPlayer] = field;
  room.ships[indexPlayer] = ships;

  if (room.roomUsers.every((user) => room.fields[user.index])) {
    const playersId = room.roomUsers.map((user) => user.index);
    console.log('playersId ', playersId);

    room.currentPlayer = playersId[Math.round(Math.random())];

    room.roomSockets.forEach((socket) => {
      const data = {
        ships: room.ships[socket.userId],
        currentPlayerIndex: room.currentPlayer,
      };

      socket.send(createResponse('start_game', data));

      socket.send(createResponse('turn', { currentPlayer: room.currentPlayer }));
    });
  }
};
export default addShips;
