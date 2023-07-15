import { BOT_ID, DAMAGE, MISS, TIME_INTERVAL } from '../../app/variables.js';
import { createResponse } from '../helpers/responses.js';
import { checkIsAliveShip, checkShoutResult, createKilledShip, getRandomCeil } from '../helpers/field.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket } from '../../app/types.js';

const botAttack = (ws: CustomWebSocket) => {
  let isBotAction = true;
  const field = ws.room.fields[ws.userId];
  let points: AttackType[] = [];

  if (!field || ws.room.currentPlayer !== BOT_ID) return;


  while (isBotAction) {
    const randomElement = getRandomCeil(field);

    const point = checkShoutResult(field, randomElement )
    field[randomElement.y][randomElement.x] = point;

    if (point === MISS) {
      isBotAction = false;
      points.push({
        position: {
          x: randomElement.x,
          y: randomElement.y,
        },
        currentPlayer: BOT_ID,
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
          currentPlayer: BOT_ID,
          status: 'shot',
        });
      }
    }
    checkEnd(ws, field, BOT_ID);
  }

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
    }, TIME_INTERVAL);
  });
};

export default botAttack;
