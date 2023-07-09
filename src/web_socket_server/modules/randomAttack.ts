import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';
import { checkSurroundingCells } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';

const randomAttack = (ws: WebSocket & { userId: number }, data: string) => {
  const { gameId, indexPlayer } = JSON.parse(data);

  const anotherPlayer = rooms
    .getById(gameId)
    ?.roomUsers.map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];

  const room = rooms.getById(gameId);

  const field = fields.getById(gameId, anotherPlayer || 0);

  const fieldValue = field?.field;
  if (!fieldValue) {
    return;
  }

  const possibilityOfShot: { x: number; y: number }[] = [];
  fieldValue.forEach((row, i) => {
    row.forEach((col, j) => {
      if (fieldValue[i][j] === SEA || fieldValue[i][j] === SHIP) {
        possibilityOfShot.push({ x: j, y: i });
      }
    });
  });
  const randomElement = possibilityOfShot[Math.floor(Math.random() * possibilityOfShot.length)];

  let status: 'miss' | 'killed' | 'shot' = 'miss';
  if (field?.field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point =
      field.field[randomElement.y][randomElement.x] === SHIP
        ? DAMAGE
        : field.field[randomElement.y][randomElement.x] === DAMAGE
        ? DAMAGE
        : MISS;

    const result = checkSurroundingCells(field.field, randomElement.x, randomElement.y);

    const updatedField = fields.update(
      { gameId: gameId, x: randomElement.x, y: randomElement.y, indexPlayer: anotherPlayer },
      point
    );

    if (result && point === DAMAGE) {
      status = 'shot';
    }
    if (!result && point === DAMAGE) {
      status = 'killed';
    }

    const data = {
      position: {
        x: randomElement.x,
        y: randomElement.y,
      },
      currentPlayer: indexPlayer,
      status: status,
    };
    const resObj = {
      type: 'attack',
      data: JSON.stringify(data),
      id: 0,
    };

    const nextIndex = status === 'miss' ? anotherPlayer : indexPlayer;
    const nextPlayer = {
      type: 'turn',
      data: JSON.stringify({
        currentPlayer: nextIndex,
      }),
      id: 0,
    };
    rooms.setNex(nextIndex, gameId);

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(resObj));
      client.send(JSON.stringify(nextPlayer));
    });

    if (!updatedField?.field) {
      return;
    }
    checkEnd(ws, updatedField.field, indexPlayer);
  }
};
export default randomAttack;
