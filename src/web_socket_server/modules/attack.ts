import { BOT_ID, DAMAGE, MISS, SHIP } from '../../app/variables.js';

import { checkIsAliveShip, createKilledShip, createResponse } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket, StatusType } from '../../app/types.js';
import { rooms } from '../../data/rooms.js';
import botAttack from './botAttack.js';

const attack = (ws: CustomWebSocket, data: string) => {
  const parsedData = JSON.parse(data);
  const { gameId, x, y, indexPlayer } = parsedData as {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  const room = rooms.getById(gameId);
  if (!room) {
    return
  }
  const anotherPlayer = room.roomUsers
    .map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];
  const field = room.fields[anotherPlayer];

  let status: StatusType = 'miss';

  if (field && anotherPlayer && room.currentPlayer === indexPlayer) {
    const point = field[y][x] === SHIP ? DAMAGE : field[y][x] === DAMAGE ? DAMAGE : MISS;
    const isAlive = checkIsAliveShip(field, x, y);
    field[y][x] = point;


    let points: AttackType[] = [];

    if (isAlive && point === DAMAGE) {
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
    } else if (!isAlive && point === DAMAGE) {
      status = 'killed';
      points = createKilledShip(field, x, y, indexPlayer);
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

    ws.room.currentPlayer = status === 'miss' ? anotherPlayer : indexPlayer;

    ws.room.roomSockets.forEach((socket) => {
      points.forEach((data) => {
        socket.send(createResponse('attack', data));
      });
      socket.send(createResponse('turn', { currentPlayer: ws.room.currentPlayer }));
    });

    checkEnd(ws, field, indexPlayer);
    if (ws.room.isSingle && ws.room.currentPlayer === BOT_ID) {
      botAttack(ws)
    }
  }
};
export default attack;
