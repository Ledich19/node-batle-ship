import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, SEA, SHIP } from '../../app/variables.js';
import { FieldType } from '../../app/types.js';
import { wss } from '../../index.js';

const checkSurroundingCells = (field: string[][], x: number, y: number) => {
  const top = y > 0 && field[y - 1][x] === SHIP; // Ячейка сверху
  const bottom = y < field.length - 1 && field[y + 1][x] === SHIP; // Ячейка снизу
  const left = x > 0 && field[y][x - 1] === SHIP; // Ячейка слева
  const right = x < field[y].length - 1 && field[y][x + 1] === SHIP; // Ячейка справа
  return top || bottom || left || right;
};

const attack = (ws: WebSocket & { userId: number }, data: string) => {
  const userId = ws.userId;
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const room = rooms.getById(gameId)
  const anotherPlayer = rooms
    .getById(gameId)
    ?.roomUsers.map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];
  const field = fields.getById(gameId, anotherPlayer || 0);
  let status: 'miss' | 'killed' | 'shot' = 'miss';
  
  
  if (field?.field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point = field.field[y][x] === SHIP ? DAMAGE : field.field[y][x];
    const result = checkSurroundingCells(field.field, x, y);
    if (result && point === DAMAGE) {
      status = 'shot';
    }
    if (!result && point === DAMAGE) {
      status = 'killed';
    }

    const data = {
      position: {
        x: x,
        y: y,
      },
      currentPlayer: indexPlayer,
      status: status,
    };
    const resObj = {
      type: 'attack',
      data: JSON.stringify(data),
      id: 0,
    };

    const nextIndex = status === 'miss' ? anotherPlayer : indexPlayer
    const nextPlayer = {
      type: 'turn',
      data: JSON.stringify({
        currentPlayer: nextIndex ,
      }),
      id: 0,
    };
    rooms.setNex(nextIndex, gameId)


    wss.clients.forEach((client) => {
      client.send(JSON.stringify(resObj));
      client.send(JSON.stringify(nextPlayer));
    });
  }

  // const nextPlayer = {
  //   type: 'turn',
  //   data: JSON.stringify({
  //     currentPlayer: status === 'miss' ? anotherPlayer : indexPlayer,
  //   }),
  //   id: 0,
  // };

  // wss.clients.forEach((client) => {
  //   client.send(JSON.stringify(nextPlayer));
  // });
};
export default attack;
