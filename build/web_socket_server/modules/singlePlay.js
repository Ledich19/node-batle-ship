import { BOT_ID, FiELD_SIZE, SEA, SHIP } from '../../app/variables.js';
import { createResponse } from '../helpers/responses.js';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';
const singlePlay = (ws) => {
    const roomId = rooms.createId();
    const { userId } = ws;
    const user = users.getById(ws.userId);
    if (!user) {
        return;
    }
    function generateRandomPlacement() {
        const ships = [
            { type: 'huge', length: 4 },
            { type: 'large', length: 3 },
            { type: 'large', length: 3 },
            { type: 'medium', length: 2 },
            { type: 'medium', length: 2 },
            { type: 'medium', length: 2 },
            { type: 'small', length: 1 },
            { type: 'small', length: 1 },
            { type: 'small', length: 1 },
            { type: 'small', length: 1 },
        ];
        const field = Array(FiELD_SIZE)
            .fill(SEA)
            .map(() => Array(FiELD_SIZE).fill(SEA));
        const placement = [];
        for (const ship of ships) {
            let validPlacement = false;
            let shipPlacement;
            while (!validPlacement) {
                shipPlacement = generateRandomShipPlacement(ship, FiELD_SIZE);
                validPlacement = validateShipPlacement(shipPlacement, field);
            }
            if (!shipPlacement) {
                return { ships: [], field: [[]] };
            }
            placeShip(shipPlacement, field);
            placement.push(shipPlacement);
        }
        return { ships: placement, field: field };
    }
    function generateRandomShipPlacement(ship, size) {
        const position = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size),
        };
        const direction = Math.random() < 0.5;
        return { position, direction, ...ship };
    }
    function validateShipPlacement(shipPlacement, grid) {
        const { position, direction, length } = shipPlacement;
        const { x, y } = position;
        const maxX = grid[0].length - 1;
        const maxY = grid.length - 1;
        if (direction) {
            if (x > maxX || y + length - 1 > maxY) {
                return false;
            }
            for (let i = y; i <= y + length - 1; i++) {
                if (grid[i][x] === SHIP) {
                    return false;
                }
                if (x > 0 && grid[i][x - 1] === SHIP) {
                    return false;
                }
                if (x < maxX && grid[i][x + 1] === SHIP) {
                    return false;
                }
                if (i > 0) {
                    if (grid[i - 1][x] === SHIP ||
                        (x > 0 && grid[i - 1][x - 1] === SHIP) ||
                        (x < maxX && grid[i - 1][x + 1] === SHIP)) {
                        return false;
                    }
                }
                if (i < maxY) {
                    if (grid[i + 1][x] === SHIP ||
                        (x > 0 && grid[i + 1][x - 1] === SHIP) ||
                        (x < maxX && grid[i + 1][x + 1] === SHIP)) {
                        return false;
                    }
                }
            }
        }
        else {
            if (x + length - 1 > maxX || y > maxY) {
                return false;
            }
            for (let i = x; i <= x + length - 1; i++) {
                if (grid[y][i] === SHIP) {
                    return false;
                }
                if (y > 0 && grid[y - 1][i] === SHIP) {
                    return false;
                }
                if (y < maxY && grid[y + 1][i] === SHIP) {
                    return false;
                }
                if (i > 0) {
                    if (grid[y][i - 1] === SHIP ||
                        (y > 0 && grid[y - 1][i - 1] === SHIP) ||
                        (y < maxY && grid[y + 1][i - 1] === SHIP)) {
                        return false;
                    }
                }
                if (i < maxX) {
                    if (grid[y][i + 1] === SHIP ||
                        (y > 0 && grid[y - 1][i + 1] === SHIP) ||
                        (y < maxY && grid[y + 1][i + 1] === SHIP)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    function placeShip(shipPlacement, grid) {
        const { position, direction, length } = shipPlacement;
        const { x, y } = position;
        if (direction) {
            for (let i = y; i <= y + length - 1; i++) {
                grid[i][x] = SHIP;
            }
        }
        else {
            for (let i = x; i <= x + length - 1; i++) {
                grid[y][i] = SHIP;
            }
        }
    }
    const placement = generateRandomPlacement();
    placement === null || placement === void 0 ? void 0 : placement.field.forEach((element) => {
        console.log(element.toString());
    });
    const field = Array(FiELD_SIZE)
        .fill(SEA)
        .map(() => Array(FiELD_SIZE).fill(SEA));
    placement === null || placement === void 0 ? void 0 : placement.ships.forEach((ship) => {
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
    field.forEach((element) => {
        console.log(element.toString());
    });
    const room = {
        currentPlayer: userId,
        roomId: roomId,
        isSingle: true,
        roomUsers: [
            { name: user.name, index: userId },
            { name: 'BOT', index: BOT_ID },
        ],
        roomSockets: [ws],
        fields: {},
        ships: {},
    };
    room.fields[userId] = null;
    room.ships[userId] = null;
    room.fields[BOT_ID] = placement.field;
    room.ships[BOT_ID] = placement.ships;
    rooms.create(room);
    ws.room = room;
    const resData = {
        idGame: room === null || room === void 0 ? void 0 : room.roomId,
        idPlayer: ws.userId,
    };
    ws.send(createResponse('create_game', resData));
};
export default singlePlay;
//# sourceMappingURL=singlePlay.js.map