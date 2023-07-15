import { AttackType, Field, PositionXY } from '../../app/types.js';
import { DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';

const createPoints = (field: Field, x: number, y: number, rules: string[]) => {
  const top = y > 0 && rules.includes(field[y - 1][x]) ? { x, y: y - 1 } : null;
  const bottom = y < field.length - 1 && rules.includes(field[y + 1][x]) ? { x, y: y + 1 } : null;
  const left = x > 0 && rules.includes(field[y][x - 1]) ? { x: x - 1, y } : null;
  const right = x < field[y].length - 1 && rules.includes(field[y][x + 1]) ? { x: x + 1, y } : null;
  return { top, bottom, left, right };
};

export const checkIsAliveShip = (field: Field, x: number, y: number): boolean | null => {
  const startX = x;
  const startY = y;
  const visited: boolean[][] = []; // Массив для отслеживания посещенных клеток

  const recursiveCheck = (field: Field, x: number, y: number): boolean | null => {
    if (typeof x !== 'number' || typeof y !== 'number' || visited[y]?.[x]) {
      return false;
    }

    visited[y] = visited[y] || [];
    visited[y][x] = true;

    const ship = field[y][x] === SHIP;

    if (ship && (x !== startX || y !== startY)) {
      return true;
    }

    const { top, bottom, left, right } = createPoints(field, x, y, [DAMAGE, SHIP]);

    const hasShipTop = top && recursiveCheck(field, top.x, top.y);
    const hasShipBottom = bottom && recursiveCheck(field, bottom.x, bottom.y);
    const hasShipLeft = left && recursiveCheck(field, left.x, left.y);
    const hasShipRight = right && recursiveCheck(field, right.x, right.y);

    return hasShipTop || hasShipBottom || hasShipLeft || hasShipRight;
  };

  const result = recursiveCheck(field, x, y);

  return result;
};

export const findDAmageShip = (field: Field, x: number, y: number, points: AttackType[]) => {
  const { top, bottom, left, right } = createPoints(field, x, y, [DAMAGE]);

  if (top && !points.find((point) => point.position.x === top.x && point.position.y === top.y)) {
    return { x: top.x, y: top.y };
  }
  if (
    bottom &&
    !points.find((point) => point.position.x === bottom.x && point.position.y === bottom.y)
  ) {
    return { x: bottom.x, y: bottom.y };
  }
  if (left && !points.find((point) => point.position.x === left.x && point.position.y === left.y)) {
    return { x: left.x, y: left.y };
  }
  if (
    right &&
    !points.find((point) => point.position.x === right.x && point.position.y === right.y)
  ) {
    return { x: right.x, y: right.y };
  }

  return null;
};

export const createKilledShip = (
  field: Field,
  x: number,
  y: number,
  currentPlayer: number
): AttackType[] => {
  const points: AttackType[] = [];
  let point: PositionXY | null = {
    x: x,
    y: y,
  };

  while (point) {
    if (point) {
      points.push({
        position: {
          x: point.x,
          y: point.y,
        },
        currentPlayer: currentPlayer,
        status: 'killed',
      });
    }
    point = findDAmageShip(field, point.x, point.y, points);
  }
  const iterations = points.length;
  for (let i = 0; i < iterations; i++) {
    const pointX: number = points[i].position.x;
    const pointY: number = points[i].position.y;

    const topPoint = { x: pointX, y: pointY - 1 };
    const bottomPoint = { x: pointX, y: pointY + 1 };
    const leftPoint = { x: pointX - 1, y: pointY };
    const rightPoint = { x: pointX + 1, y: pointY };
    const topLeftPoint = { x: pointX - 1, y: pointY - 1 };
    const topRightPoint = { x: pointX + 1, y: pointY - 1 };
    const bottomLeftPoint = { x: pointX - 1, y: pointY + 1 };
    const bottomRightPoint = { x: pointX + 1, y: pointY + 1 };

    if (pointY > 0 && field[topPoint.y][topPoint.x] !== DAMAGE) {
      points.push({
        position: {
          x: pointX,
          y: pointY - 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (pointY < field.length - 1 && field[bottomPoint.y][bottomPoint.x] !== DAMAGE) {
      points.push({
        position: {
          x: pointX,
          y: pointY + 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (pointX > 0 && field[leftPoint.y][leftPoint.x] !== DAMAGE) {
      points.push({
        position: {
          x: pointX - 1,
          y: pointY,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (pointX < field[pointY].length - 1 && field[rightPoint.y][rightPoint.x] !== DAMAGE) {
      points.push({
        position: {
          x: pointX + 1,
          y: pointY,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (pointY > 0 && pointX > 0 && field[topLeftPoint.y][topLeftPoint.x] !== DAMAGE) {
      points.push({
        position: {
          x: pointX - 1,
          y: pointY - 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (
      pointY > 0 &&
      pointX < field[pointY].length - 1 &&
      field[topRightPoint.y][topRightPoint.x] !== DAMAGE
    ) {
      points.push({
        position: {
          x: pointX + 1,
          y: pointY - 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (
      pointY < field.length - 1 &&
      pointX > 0 &&
      field[bottomLeftPoint.y][bottomLeftPoint.x] !== DAMAGE
    ) {
      points.push({
        position: {
          x: pointX - 1,
          y: pointY + 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }

    if (
      pointY < field.length - 1 &&
      pointX < field[pointY].length - 1 &&
      field[bottomRightPoint.y][bottomRightPoint.x] !== DAMAGE
    ) {
      points.push({
        position: {
          x: pointX + 1,
          y: pointY + 1,
        },
        currentPlayer: currentPlayer,
        status: 'miss',
      });
    }
  }
  const uniquePoints = points.filter((value, index, self) => {
    const { x, y } = value.position;
    return self.findIndex((p) => p.position.x === x && p.position.y === y) === index;
  });

  return uniquePoints;
};

export const getRandomCeil = (field: Field) => {
  const possibilityOfShot: PositionXY[] = [];
  field.forEach((row, i) => {
    row.forEach((col, j) => {
      if (field[i][j] === SEA || field[i][j] === SHIP) {
        possibilityOfShot.push({ x: j, y: i });
      }
    });
  });
  return possibilityOfShot[Math.floor(Math.random() * possibilityOfShot.length)];
};

export const checkShoutResult = (field: Field, position: PositionXY) => {
  const point =
    field[position.y][position.x] === SHIP
      ? DAMAGE
      : field[position.y][position.x] === DAMAGE
      ? DAMAGE
      : MISS;
  return point;
};
