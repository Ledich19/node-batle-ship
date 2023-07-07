import { FieldType, RoomType } from '../types.js';

const fieldsData: FieldType[] = [
  {
    roomId: 0,
    userId: 0,
    field: null,
  },
];

export const get = (): FieldType[] => {
  return fieldsData;
};
export const getById = (roomId: number, userId: number): FieldType | undefined => {
  return fieldsData.find((field) => field.roomId === roomId && field.userId === userId);
};
const create = (roomId: number, userId: number, field: number[][]) => {
  fieldsData.push({
    roomId,
    userId,
    field,
  });

  return fieldsData.find((field) => field.roomId === roomId && field.userId === userId);
};

export const fields = {
  get,
  getById,
  create,
};
// export const createId = () => {
// }
