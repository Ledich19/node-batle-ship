import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';
import { checkSurroundingCells, createKilledShip, createResponse } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, StatusType } from '../../app/types.js';

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

  let status: StatusType = 'miss';
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



    let points: AttackType[] = [];
    if (result && point === DAMAGE) {
      status = 'shot';
      points = [
        {
          position: {
            x: randomElement.x,
            y: randomElement.y,
          },
          currentPlayer: indexPlayer,
          status: status,
        }
      ];
    }
    else if (!result && point === DAMAGE) {
      status = 'killed';
      points = createKilledShip(field.field, randomElement.x, randomElement.y, indexPlayer);
    } else {
      points = [
        {
          position: {
            x: randomElement.x,
            y: randomElement.y,
          },
          currentPlayer: indexPlayer,
          status: status,
        }
      ];
    }

  

    const nextIndex = status === 'miss' ? anotherPlayer : indexPlayer;

    rooms.setNex(nextIndex, gameId);

    wss.clients.forEach((client) => {
      points.forEach((data) => {
        client.send(createResponse('attack', data));
      });
      client.send(createResponse('turn', { currentPlayer: nextIndex }));
    });

    if (!updatedField?.field) {
      return;
    }
    checkEnd(ws, updatedField.field, indexPlayer);
  }
};
export default randomAttack;
