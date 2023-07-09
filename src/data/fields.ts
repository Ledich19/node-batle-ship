import { FieldType } from '../app/types.js';

const fieldsData: FieldType[] = [
  {
    roomId: 0,
    userId: 0,
    field: null,
    ships: [],
  },
];

export const get = (): FieldType[] => {
  return fieldsData;
};
export const getById = (roomId: number, userId: number): FieldType | undefined => {
  return fieldsData.find((field) => field.roomId === roomId && field.userId === userId);
};
const create = (roomId: number, userId: number, field: string[][], ships: []) => {
  fieldsData.push({
    roomId,
    userId,
    field,
    ships,
  });

  return fieldsData.find((field) => field.roomId === roomId && field.userId === userId);
};
const check = (roomId: number): boolean => {
  const fields = fieldsData.filter((field) => field.roomId === roomId);
  return fields.length === 2;
};

const update = (
  { gameId, x, y, indexPlayer }: { gameId: number; x: number; y: number; indexPlayer: number },
  sign: string
): FieldType | undefined => {
  const field = fieldsData.find((field) => field.roomId === gameId && field.userId === indexPlayer);
  if (field?.field) {
    field.field[y][x] = sign;
    return field
  }
};

export const fields = {
  get,
  getById,
  create,
  check,
  update,
};
// export const createId = () => {
// }
