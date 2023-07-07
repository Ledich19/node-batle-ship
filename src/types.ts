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
    field: number[][] | null;
  }[];
};
export type ShipType = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};
