import { Point } from '@nut-tree/nut-js';
import { AttackType, ResponseType } from './types.js';
import { DAMAGE, SHIP } from './variables.js';

export const checkSurroundingCells = (field: string[][], x: number, y: number) => {
  const top = y > 0 && field[y - 1][x] === SHIP;
  const bottom = y < field.length - 1 && field[y + 1][x] === SHIP;
  const left = x > 0 && field[y][x - 1] === SHIP;
  const right = x < field[y].length - 1 && field[y][x + 1] === SHIP;

  return top || bottom || left || right;
};

export const findDAmageShip = (field: string[][], x: number, y: number, points: AttackType[]) => {
  const top = y > 0 && field[y - 1][x] === DAMAGE;
  const bottom = y < field.length - 1 && field[y + 1][x] === DAMAGE;
  const left = x > 0 && field[y][x - 1] === DAMAGE;
  const right = x < field[y].length - 1 && field[y][x + 1] === DAMAGE;
  console.log(x, y);
  console.log(top, bottom, left, right);

  if (top && !points.find((point) => point.position.x === x && point.position.y === y - 1)) {
    return { x, y: y - 1 };
  }
  if (bottom && !points.find((point) => point.position.x === x && point.position.y === y + 1)) {
    return { x, y: y + 1 };
  }
  if (left && !points.find((point) => point.position.x === x - 1 && point.position.y === y)) {
    return { x: x - 1, y };
  }
  if (right && !points.find((point) => point.position.x === x + 1 && point.position.y === y)) {
    return { x: x + 1, y };
  }

  return null;
};

export const createResponse = <T>(type: ResponseType, data: T): string => {
  const response = {
    type: type,
    data: JSON.stringify(data),
    id: 0,
  };
  return JSON.stringify(response);
};

export const createKilledShip = (
  field: string[][],
  x: number,
  y: number,
  currentPlayer: number
): AttackType[] => {
  const points: AttackType[] = [];
  let point: {
    x: number;
    y: number;
  } | null = {
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

    if (
      pointY > 0 &&
      pointX > 0 &&
      field[topLeftPoint.y][topLeftPoint.x] !== DAMAGE
    ) {
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
    return (
      self.findIndex((p) => p.position.x === x && p.position.y === y) === index
    );
  });

  return uniquePoints;
};
