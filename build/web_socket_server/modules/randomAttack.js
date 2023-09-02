import { BOT_ID, DAMAGE } from '../../app/variables.js';
import { createResponse } from '../helpers/responses.js';
import { checkIsAliveShip, checkShoutResult, createKilledShip, getRandomCeil, } from '../helpers/field.js';
import checkEnd from './checkEnd.js';
import { rooms } from '../../data/rooms.js';
import botAttack from './botAttack.js';
const randomAttack = (ws, data) => {
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
    let status = 'miss';
    if (field && anotherPlayer && (room === null || room === void 0 ? void 0 : room.currentPlayer) === indexPlayer) {
        const point = checkShoutResult(field, randomElement);
        field[randomElement.y][randomElement.x] = point;
        const isAlive = checkIsAliveShip(field, randomElement.x, randomElement.y);
        let points = [];
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
        }
        else if (!isAlive && point === DAMAGE) {
            status = 'killed';
            points = createKilledShip(field, randomElement.x, randomElement.y, indexPlayer);
        }
        else {
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
        if (ws.room.isSingle && ws.room.currentPlayer === BOT_ID) {
            botAttack(ws);
        }
    }
};
export default randomAttack;
//# sourceMappingURL=randomAttack.js.map