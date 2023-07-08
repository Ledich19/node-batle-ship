import WebSocket from "ws";

export type UserType = {
  id: number;
  name: string;
  password: string;
  wins: number;
};
export type FieldType = {
  roomId: number;
  userId: number;
  field: string[][] | null;
  ships: []
};

export type RoomType = {
  currentPlayer: number;
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
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
export type CustomWebSocket = WebSocket & { userId: number };