import { RoomType } from '../app/types.js';

const roomsData: RoomType[] = [
  {
    currentPlayer: 0,
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
  return roomsData;
};
export const getById = (id: number): RoomType | undefined => {
  return roomsData.find((room) => room.roomId === id);
};
export const create = (room: RoomType): RoomType[] => {

  roomsData.push(room);
  return roomsData;
};
export const add = (user: { name: string; index: number }, indexRoom: number): RoomType | null => {
  const room = roomsData.find((room) => room.roomId === indexRoom);
  if (room?.roomUsers) {
    room.roomUsers = room?.roomUsers.concat(user);
    return room;
  }
  return null;
};
export const setNex = (userId: number, indexRoom: number) => {
  const room = roomsData.find((room) => room.roomId === indexRoom);
  if (room?.currentPlayer) {
    
    room.currentPlayer = userId;
  }
};

export const rooms = {
  createId,
  get,
  getById,
  create,
  add,
  setNex,
};
// export const createId = () => {
// }
