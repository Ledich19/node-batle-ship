import { BOT_ID, DAMAGE, MISS, SEA, SHIP, TIME_INTERVAL } from '../../app/variables.js';
import { createResponse } from '../helpers/responses.js';
import {
  checkIsAliveShip,
  checkShoutResult,
  createKilledShip,
  createPoints,
  createShootOption,
  getRandomCeil,
} from '../helpers/field.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket, PositionXY } from '../../app/types.js';

const botAttack = (ws: CustomWebSocket) => {
  let isBotAction = true;
  const field = ws.room.fields[ws.userId];
  const points: AttackType[] = [];

  if (!field || ws.room.currentPlayer !== BOT_ID) return;

  while (isBotAction) {
    let nextShot: PositionXY | null = null;
    const successBotShot = ws.room.successBotShot;

    if (successBotShot) {
      const shotOptions = []
      const goals = createPoints(field, successBotShot.x, successBotShot.y, [SEA, SHIP]);
      const values = Object.values(goals).filter((el) => !!el);
      const damagesPoints = createPoints(field, successBotShot.x, successBotShot.y, [DAMAGE]);
      const damagesPointsValues = Object.values(damagesPoints).filter((el) => !!el);
      
      if (damagesPointsValues.length > 0) {
        const values = createShootOption(field, successBotShot.x, successBotShot.y)
        shotOptions.push(...values)
      } else {
        shotOptions.push(...values)
      }


      const randomIndex = Math.floor(Math.random() * shotOptions.length);
      nextShot = shotOptions[randomIndex];
    }

    const randomElement = nextShot ? nextShot : getRandomCeil(field);
    const point = checkShoutResult(field, randomElement);

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
        setTimeout(() => {
          ws.room.roomSockets.forEach((socket) => {
            killedShip.forEach((data) => {
              socket.send(createResponse('attack', data));
            });
          });
          ws.room.successBotShot = null;
        }, TIME_INTERVAL);
      } else {
        points.push({
          position: {
            x: randomElement.x,
            y: randomElement.y,
          },
          currentPlayer: BOT_ID,
          status: 'shot',
        });

        ws.room.successBotShot = { x: randomElement.x, y: randomElement.y };
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
