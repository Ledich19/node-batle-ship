import { RoomType } from '../types.js';

const roomsData: RoomType[] = [
  {
    roomId: 0,
    roomUsers: [
      {
        name: '<string>',
        index: 0,
        field: null,
      },
      {
        name: '<string>',
        index: 0,
        field: null,
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
const setShips = (roomId:number , userId:number , field: number[][]) => {
  const room = roomsData.find((room) => room.roomId === roomId )
  room?.roomUsers.map((user) => {if (user.index === userId) {
    return {...user,field: field}
  }})
  return room?.roomUsers.length && room?.roomUsers.every((user) => user.field !== null)
}

export const rooms = {
  createId,
  get,
  getById,
  create,
  setShips,
};
// export const createId = () => {
// }
