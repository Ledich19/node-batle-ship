import { DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';
import { checkIsAliveShip, createKilledShip, createResponse } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket, StatusType } from '../../app/types.js';
import { rooms } from '../../data/rooms.js';

const randomAttack = (ws: CustomWebSocket, data: string) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const room = rooms.getById(gameId);
  if (!room) {
    return
  }
  const anotherPlayer = room.roomUsers
    .map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];
  const field = room.fields[anotherPlayer];

  if (!field) {
    return;
  }

  const possibilityOfShot: { x: number; y: number }[] = [];
  field.forEach((row, i) => {
    row.forEach((col, j) => {
      if (field[i][j] === SEA || field[i][j] === SHIP) {
        possibilityOfShot.push({ x: j, y: i });
      }
    });
  });
  const randomElement = possibilityOfShot[Math.floor(Math.random() * possibilityOfShot.length)];

  let status: StatusType = 'miss';
  if (field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point =
      field[randomElement.y][randomElement.x] === SHIP
        ? DAMAGE
        : field[randomElement.y][randomElement.x] === DAMAGE
        ? DAMAGE
        : MISS;

    field[randomElement.y][randomElement.x] = point;
    const isAlive = checkIsAliveShip(field, randomElement.x, randomElement.y);


    let points: AttackType[] = [];
    if (isAlive && point === DAMAGE) {
      status = 'shot';
      points = [
        {
          position: {
            x: randomElement.x,
            y: randomElement.y,
          },
          currentPlayer: indexPlayer,
          status: status,
        },
      ];
    } else if (!isAlive && point === DAMAGE) {
      status = 'killed';
      points = createKilledShip(field, randomElement.x, randomElement.y, indexPlayer);
    } else {
      points = [
        {
          position: {
            x: randomElement.x,
            y: randomElement.y,
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
  }
};
export default randomAttack;
