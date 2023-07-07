import WebSocket from 'ws';
import { users } from '../../data/users.js';
import { ShipType } from '../../types.js';
import { rooms } from '../../data/rooms.js';
import { fields } from '../../data/fields.js';

const addShips = (ws: WebSocket & { userId: number }, data: string) => {
  const FiELD_SIZE = 10;

  const { gameId, ships, indexPlayer } = JSON.parse(data);

  console.log(gameId, ships, indexPlayer);

  const field = Array(FiELD_SIZE)
    .fill(0)
    .map(() => Array(FiELD_SIZE).fill(0));

  ships.forEach((ship: ShipType) => {
    const { position, direction, type, length } = ship;
    for (let i = 0; i < length; i++) {
      if (direction) {
        field[position.y + i][position.x] = 1;
      } else {
        field[position.y][position.x + i] = 1;
      }
    }
  });
  fields.create(gameId, indexPlayer, field)
  field.forEach((element) => {
    console.log(`${element}`);
  });
};
export default addShips;
