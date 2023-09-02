import { BOT_ID, FiELD_SIZE, SEA, SHIP } from '../../app/variables.js';
import { rooms } from '../../data/rooms.js';
import { createResponse } from '../helpers/responses.js';
import botAttack from './botAttack.js';
const addShips = (ws, data) => {
    const { gameId, ships, indexPlayer } = JSON.parse(data);
    const room = rooms.getById(gameId);
    if (!room) {
        return;
    }
    const field = Array(FiELD_SIZE)
        .fill(SEA)
        .map(() => Array(FiELD_SIZE).fill(SEA));
    ships.forEach((ship) => {
        const { position, direction, length } = ship;
        for (let i = 0; i < length; i++) {
            if (direction) {
                field[position.y + i][position.x] = SHIP;
            }
            else {
                field[position.y][position.x + i] = SHIP;
            }
        }
    });
    room.fields[indexPlayer] = field;
    room.ships[indexPlayer] = ships;
    if (room.roomUsers.every((user) => room.fields[user.index])) {
        const playersId = room.roomUsers.map((user) => user.index);
        room.currentPlayer = playersId[Math.round(Math.random())];
        room.roomSockets.forEach((socket) => {
            const data = {
                ships: room.ships[socket.userId],
                currentPlayerIndex: room.currentPlayer,
            };
            socket.send(createResponse('start_game', data));
            socket.send(createResponse('turn', { currentPlayer: room.currentPlayer }));
        });
    }
    if (ws.room.isSingle && ws.room.currentPlayer === BOT_ID) {
        botAttack(ws);
    }
};
export default addShips;
//# sourceMappingURL=add-ships.js.map