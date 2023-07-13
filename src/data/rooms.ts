import { RoomType } from '../app/types.js';

const roomsData: RoomType[] = [
];

export const createId = (): number => {
  const allId = roomsData.map((room) => room.roomId);
  return allId.length > 0 ? Math.max(...allId) + 1 : 1;
};
export const get = (): RoomType[] => {
  return roomsData;
};
export const getById = (id: number): RoomType | undefined => {
  return roomsData.find((room) => room.roomId === id);
};
export const create = (room: RoomType): RoomType[] => {
  roomsData.push(room);
  return roomsData;
};


export const rooms = {
  createId,
  get,
  getById,
  create,

};

