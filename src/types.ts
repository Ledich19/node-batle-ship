export type UserType = {
  id: number;
  name: string;
  password: string;
  wins: number;
};



export type RoomType = {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
    field: number[][];
  }[];
};
