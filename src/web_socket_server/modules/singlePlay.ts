import { CustomWebSocket, ShipType, SizeType } from '../../app/types.js';

import { FiELD_SIZE, SEA, SHIP } from '../../app/variables.js';
import { createResponse } from '../../app/healpers.js';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';

const singlePlay = (ws: CustomWebSocket, data: string) => {
  const roomId = rooms.createId();
  const { userId } = ws;
  const user = users.getById(ws.userId);
  if (!user) {
    return;
  }

  function generateRandomPlacement(): { ships: ShipType[], field: string[][] } {
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
  
    const field: string[][] = Array(FiELD_SIZE)
      .fill(SEA)
      .map(() => Array(FiELD_SIZE).fill(SEA));
  
    const placement: ShipType[] = [];
  
    for (const ship of ships) {
      let validPlacement = false;
      let shipPlacement: ShipType | undefined;
  
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
  
  function generateRandomShipPlacement(ship: { type: string; length: number }, size: number): ShipType {
    const position = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };
    const direction = Math.random() < 0.5;
    return { position, direction, ...ship } as ShipType;
  }
  
  function validateShipPlacement(shipPlacement: ShipType, grid: string[][]): boolean {
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
          if (grid[i - 1][x] === SHIP || (x > 0 && grid[i - 1][x - 1] === SHIP) || (x < maxX && grid[i - 1][x + 1] === SHIP)) {
            return false;
          }
        }
        if (i < maxY) {
          if (grid[i + 1][x] === SHIP || (x > 0 && grid[i + 1][x - 1] === SHIP) || (x < maxX && grid[i + 1][x + 1] === SHIP)) {
            return false;
          }
        }
      }
    } else {
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
          if (grid[y][i - 1] === SHIP || (y > 0 && grid[y - 1][i - 1] === SHIP) || (y < maxY && grid[y + 1][i - 1] === SHIP)) {
            return false;
          }
        }
        if (i < maxX) {
          if (grid[y][i + 1] === SHIP || (y > 0 && grid[y - 1][i + 1] === SHIP) || (y < maxY && grid[y + 1][i + 1] === SHIP)) {
            return false;
          }
        }
      }
    }
  
    return true;
  }
  
  
  function placeShip(shipPlacement: ShipType, grid: string[][]): void {
    const { position, direction, length } = shipPlacement;
    const { x, y } = position;
  
    if (direction) {
      for (let i = y; i <= y + length - 1; i++) {
        grid[i][x] = SHIP;
      }
    } else {
      for (let i = x; i <= x + length - 1; i++) {
        grid[y][i] = SHIP;
      }
    }
  }
  const placement = generateRandomPlacement();
  placement?.field.forEach((element) => {
    console.log(element.toString());
  });
  placement?.ships.forEach((element) => {
    console.log(JSON.stringify(element));
  });

  ws.send(
    createResponse('start_game', {
      ships: placement?.ships,
      currentPlayerIndex: ws.userId,
    })
  );
  ws.send(
    createResponse('start_game', {
      ships: placement?.ships,
      currentPlayerIndex: 'bot',
    })
  );

  const field = Array(FiELD_SIZE)
    .fill(SEA)
    .map(() => Array(FiELD_SIZE).fill(SEA));

  placement?.ships.forEach((ship: ShipType) => {
    const { position, direction, length } = ship;
    for (let i = 0; i < length; i++) {
      if (direction) {
        field[position.y + i][position.x] = SHIP;
      } else {
        field[position.y][position.x + i] = SHIP;
      }
    }
  });
  field.forEach((element) => {
    console.log(element.toString());
  });

  // room.fields[indexPlayer] = field;
  // room.ships[indexPlayer] = ships;

  // const room = {
  //   currentPlayer: userId,
  //   roomId: roomId,
  //   isSingle: true,
  //   roomUsers: [{ name: user.name, index: userId }],
  //   roomSockets: [ws],
  //   fields: {
  //     userId: null,
  //     'bot': [],
  //   },
  //   ships: {
  //     userId: null,
  //     'bot': [],
  //   }
  // };

  // if (room.roomUsers.every((user) => room.fields[user.index])) {
  //   const playersId = room.roomUsers.map((user) => user.index);
  //   console.log('playersId ', playersId);

  //   room.currentPlayer = playersId[Math.round(Math.random())];

  //   room.roomSockets.forEach((socket) => {
  //     const data = {
  //       ships: room.ships[socket.userId],
  //       currentPlayerIndex: room.currentPlayer,
  //     };

  //     socket.send(createResponse('start_game', data));

  //     socket.send(createResponse('turn', { currentPlayer: room.currentPlayer }));
  //   });
  // }
};
export default singlePlay;
