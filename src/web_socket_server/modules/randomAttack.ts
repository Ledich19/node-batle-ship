import { DAMAGE } from '../../app/variables.js';
import {
  checkIsAliveShip,
  checkShoutResult,
  createKilledShip,
  createResponse,
  getRandomCeil,
} from '../../app/healpers.js';
import checkEnd from './checkEnd.js';
import { AttackType, CustomWebSocket, StatusType } from '../../app/types.js';
import { rooms } from '../../data/rooms.js';

const randomAttack = (ws: CustomWebSocket, data: string) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const room = rooms.getById(gameId);
  if (!room) {
    return;
  }
  const anotherPlayer = room.roomUsers
    .map((user) => user.index)
    .filter((user) => user !== indexPlayer)[0];
  const field = room.fields[anotherPlayer];

  if (!field) {
    return;
  }

  const randomElement = getRandomCeil(field);

  let status: StatusType = 'miss';
  if (field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point = checkShoutResult(field, randomElement)
  
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
