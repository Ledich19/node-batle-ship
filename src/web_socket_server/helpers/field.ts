import { AttackType, Field, PositionXY } from '../../app/types.js';
import { DAMAGE, MISS, SEA, SHIP } from '../../app/variables.js';

export const createPoints = (field: Field, x: number, y: number, rules: string[]) => {
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

const lokateShip = (field: Field, x: number, y: number): PositionXY[] => {
  const result: PositionXY[] = [{ x, y }];
  const visited: boolean[][] = [];
  const recursive = (x: number, y: number) => {
    if (typeof x !== 'number' || typeof y !== 'number' || visited[y]?.[x]) {
      return false;
    }
    visited[y] = visited[y] || [];
    visited[y][x] = true;

    const { top, bottom, left, right } = createPoints(field, x, y, [DAMAGE]);

    if (top) {
      result.push(top);
      top && recursive(top.x, top.y);
    }
    if (bottom) {
      result.push(bottom);
      bottom && recursive(bottom.x, bottom.y);
    }
    if (left) {
      result.push(left);
      left && recursive(left.x, left.y);
    }
    if (right) {
      result.push(right);
      right && recursive(right.x, right.y);
    }
  };
  recursive(x, y);
  return result;
};

function determineOrientation(cell1: PositionXY, cell2: PositionXY): boolean {
  if (cell1.x === cell2.x) {
    // Корабль вертикальный.
    return true;
  } else {
    // Корабль горизонтальный.
    return false;
  }
}
function findMinMaxProperty(
  arr: PositionXY[],
  property: keyof PositionXY
): { max: number; min: number } {
  const values = arr.map((item) => item[property]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return { max, min };
}

export const createShootOption = (field: Field, x: number, y: number) => {
  const ship = lokateShip(field, x, y);
  const result: PositionXY[] = [];
  const orientation = determineOrientation(ship[0], ship[1]);

  if (orientation) {
    const { max, min } = findMinMaxProperty(ship, 'y');
    if (max + 1 < field.length && field[max + 1][x] !== MISS) {
      result.push({ x, y: max + 1 });
    }
    if (min - 1 >= 0 && field[min - 1][x] !== MISS) {
      result.push({ x, y: min - 1 });
    }
  } else {
    const { max, min } = findMinMaxProperty(ship, 'x');
    if (max + 1 < field[0].length && field[y][max + 1] !== MISS) {
      result.push({ x: max + 1, y });
    }
    if (min - 1 >= 0 && field[y][min - 1] !== MISS) {
      result.push({ x: min - 1, y });
    }
  }

  return result;
};