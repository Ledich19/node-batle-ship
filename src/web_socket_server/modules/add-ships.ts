import WebSocket from 'ws';
import { CustomWebSocket, ShipType } from '../../app/types.js';
import { fields } from '../../data/fields.js';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';

const addShips = (ws: WebSocket & { userId: number }, data: string) => {
  const FiELD_SIZE = 10;

  const { gameId, ships, indexPlayer } = JSON.parse(data);

  const field = Array(FiELD_SIZE)
    .fill(0)
    .map(() => Array(FiELD_SIZE).fill(0));

  ships.forEach((ship: ShipType) => {
    const { position, direction, length } = ship;
    for (let i = 0; i < length; i++) {
      if (direction) {
        field[position.y + i][position.x] = 1;
      } else {
        field[position.y][position.x + i] = 1;
      }
    }
  });
  fields.create(gameId, indexPlayer, field, ships);
  field.forEach((element) => {
    console.log(`${element}`);
  });


  if (fields.check(gameId)) {
    const room = rooms.getById(gameId)
    const currentFields = fields.get().filter((field) => field.roomId === gameId )
    const playersId = currentFields.map((field) => field.userId);
    const messages = currentFields.map((field) => {
      const data = {
        ships: field.ships,
        currentPlayerIndex: field.userId,
      };
      const obg = {
        type: 'start_game',
        data: JSON.stringify(data),
        id: 0,
      };
      return obg
    });
    
    wss.clients.forEach((client) => {
      const customClient = client as CustomWebSocket;
      if (client.readyState === WebSocket.OPEN && playersId?.includes(customClient.userId)) {
        messages.forEach((message) => {
          client.send(JSON.stringify(message));
        })
      }
    });

  }
};
export default addShips;
