import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { fields } from '../../data/fields.js';
import { DAMAGE, SHIP } from '../../app/variables.js';
import { wss } from '../../index.js';
import { checkSurroundingCells } from '../../app/healpers.js';
import checkEnd from './checkEnd.js';

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

  let status: 'miss' | 'killed' | 'shot' = 'miss';

  if (field?.field && anotherPlayer && room?.currentPlayer === indexPlayer) {
    const point =
      field.field[y][x] === SHIP
        ? DAMAGE
        : field.field[y][x] === DAMAGE
        ? DAMAGE
        : field.field[y][x];
    const result = checkSurroundingCells(field.field, x, y);

    const updatedField = fields.update({ gameId, x, y, indexPlayer }, point);

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
