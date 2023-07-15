import { BOT_ID, DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';

import { checkIsAliveShip, createKilledShip, createResponse } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket, FieldType, StatusType } from '../../app/types.js';
import { rooms } from '../../data/rooms.js';

const botAttack = (ws: CustomWebSocket) => {
  let isBotAction = true;
  const field = ws.room.fields[ws.userId];
  let points: AttackType[] = [];

  if (!field || ws.room.currentPlayer !== BOT_ID) return;

  const getRandomCeil = (field: string[][]) => {
    const possibilityOfShot: { x: number; y: number }[] = [];
    field.forEach((row, i) => {
      row.forEach((col, j) => {
        if (field[i][j] === SEA || field[i][j] === SHIP) {
          possibilityOfShot.push({ x: j, y: i });
        }
      });
    });
    return possibilityOfShot[Math.floor(Math.random() * possibilityOfShot.length)];
  };

  while (isBotAction) {
    const randomElement = getRandomCeil(field);
    //let status: StatusType = 'miss';

    const point =
      field[randomElement.y][randomElement.x] === SHIP
        ? DAMAGE
        : field[randomElement.y][randomElement.x] === DAMAGE
        ? DAMAGE
        : MISS;
    console.log('POINT:::', point);

    field[randomElement.y][randomElement.x] = point;

    if (point === MISS) {
      console.log('STATUS:::', 'miss');
      isBotAction = false;
      points.push({
        position: {
          x: randomElement.x,
          y: randomElement.y,
        },
        currentPlayer: BOT_ID /* id of the player in the current game */,
        status: 'miss',
      });
    }

    if (point === DAMAGE) {
      const isAlive = checkIsAliveShip(field, randomElement.x, randomElement.y);
      if (!isAlive) {
        const killedShip = createKilledShip(field, randomElement.x, randomElement.y, BOT_ID);
        points = [...points, ...killedShip];
      } else {
        points.push({
          position: {
            x: randomElement.x,
            y: randomElement.y,
          },
          currentPlayer: BOT_ID /* id of the player in the current game */,
          status: 'shot',
        });
      }
    }
    checkEnd(ws, field, BOT_ID);
    // if (!isAlive && point === DAMAGE) {
    //   status = 'killed';
    //   points = createKilledShip(field, x, y, indexPlayer);
    // }
  }

  
console.log('Attak bot:::: ', points);

  ws.room.roomSockets.forEach((socket) => {
    let point = 0;
    const intervalId = setInterval(() => {
      const data = points[point];
      socket.send(createResponse('attack', data));
      point += 1;
      if (point === points.length) {
        clearInterval(intervalId);
        socket.send(createResponse('turn', { currentPlayer: ws.userId }));
        ws.room.currentPlayer = ws.userId;
      }
    }, 2000);
  });

  //   points.forEach((data) => {
  //     socket.send(createResponse('attack', data));
  //   });
  //  socket.send(createResponse('turn', { currentPlayer: ws.userId }));
};

export default botAttack;
