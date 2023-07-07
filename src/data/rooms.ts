import { RoomType } from '../types.js';

const roomsData: RoomType[] = [
  {
    roomId: 0,
    roomUsers: [
      {
        name: '<string>',
        index: 0,
      },
      {
        name: '<string>',
        index: 0,
      },
    ],
  },
  {
    roomId: 0,
    roomUsers: [
      {
        name: '<string>',
        index: 0,
      },
    ],
  },
];

export const createId = (): number => {
  const allId = roomsData.map((room) => room.roomId);
  return allId.length > 0 ? Math.max(...allId) + 1 : 1;
};
export const get = (): RoomType[] => {
  return roomsData
};
export const getById = (id: number): RoomType | undefined => {
  return roomsData.find((room) => room.roomId === id);
};
export const create = (room: RoomType): RoomType => {
  roomsData.push(room)
  return room
};


export const rooms = {
  createId,
  get,
  getById,
  create,
};
// export const createId = () => {
// }
