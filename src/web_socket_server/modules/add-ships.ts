import WebSocket from 'ws';
import { CustomWebSocket, ShipType } from '../../app/types.js';
import { fields } from '../../data/fields.js';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';
import { SEA, SHIP } from '../../app/variables.js';
import { createResponse } from '../../app/healpers.js';

const addShips = (ws: WebSocket & { userId: number }, data: string) => {
  const FiELD_SIZE = 10;

  const { gameId, ships, indexPlayer } = JSON.parse(data);

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
  fields.create(gameId, indexPlayer, field, ships);

  if (fields.check(gameId)) {
    const currentFields = fields.get().filter((field) => field.roomId === gameId);
    const playersId = currentFields.map((field) => field.userId);

    const currentPlayer = playersId[Math.round(Math.random())];

    rooms.setNex(currentPlayer, gameId);

    const messages = currentFields.map((field) => {
      const data = {
        ships: field.ships,
        currentPlayerIndex: field.userId,
      };
      const obg = createResponse('start_game', data)

      return { data: obg, id: field.userId };
    });

    wss.clients.forEach((client) => {
      const customClient = client as CustomWebSocket;
      if (client.readyState === WebSocket.OPEN && playersId?.includes(customClient.userId)) {
        messages.forEach((message) => {
          if (customClient.userId === message.id) {

            client.send(message.data);

          }
        });

        client.send(createResponse('turn', { currentPlayer }));
      }
    });
  }
};
export default addShips;
