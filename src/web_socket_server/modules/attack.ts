import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, MISS, SHIP } from '../../app/variables.js';
import { wss } from '../../index.js';
import { checkSurroundingCells, createKilledShip, createResponse } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, StatusType } from '../../app/types.js';

const attack = (ws: WebSocket & { userId: number }, data: string) => {
  const parsedData = JSON.parse(data);
  const { gameId, x, y, indexPlayer } = parsedData as {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  const room = rooms.getById(gameId);
  const anotherPlayer = rooms
    .getById(gameId)
    ?.roomUsers.map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];
  const field = fields.getById(gameId, anotherPlayer || 0);

  let status: StatusType = 'miss';

  if (field?.field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point =
      field.field[y][x] === SHIP ? DAMAGE : field.field[y][x] === DAMAGE ? DAMAGE : MISS;
    const result = checkSurroundingCells(field.field, x, y);
console.log('checkSurroundingCells:::::', result);

    const updatedField = fields.update({ gameId, x, y, indexPlayer: anotherPlayer }, point);

    let points: AttackType[] = [];
    if (result && point === DAMAGE) {
      status = 'shot';
      points = [
        {
          position: {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer,
          status: status,
        },
      ];
    }
    else if (!result && point === DAMAGE) {
      status = 'killed';
      points = createKilledShip(field.field, x, y, indexPlayer);
    } else {
      points = [
        {
          position: {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer,
          status: status,
        },
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
export default attack;
