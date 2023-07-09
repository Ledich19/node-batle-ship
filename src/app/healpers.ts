import { SHIP } from "./variables.js";

export const checkSurroundingCells = (field: string[][], x: number, y: number) => {
  const top = y > 0 && field[y - 1][x] === SHIP; // Ячейка сверху
  const bottom = y < field.length - 1 && field[y + 1][x] === SHIP; // Ячейка снизу
  const left = x > 0 && field[y][x - 1] === SHIP; // Ячейка слева
  const right = x < field[y].length - 1 && field[y][x + 1] === SHIP; // Ячейка справа
  return top || bottom || left || right;
};