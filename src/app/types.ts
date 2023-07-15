export type CustomWebSocket = WebSocket & { userId: number, room: RoomType };
import WebSocket from "ws";
export type StatusType = 'miss' | 'killed' | 'shot'
export type SizeType = 'small' | 'medium' | 'large' | 'huge'
export type ResponseType =
  | 'reg'
  | 'turn'
  | 'update_winners'
  | 'create_game'
  | 'update_room'
  | 'start_game'
  | 'attack'
  | 'finish';

  export type PositionXY = { x: number; y: number }
  export type Field = string[][]

export type UserType = {
  id: number;
  name: string;
  password: string;
  wins: number;
};


export type RoomType = {
  currentPlayer: number;
  roomId: number;
  isSingle?: boolean;
  successBotShot?: PositionXY | null;
  roomUsers: {name: string, index: number}[],
    roomSockets: CustomWebSocket[];
  fields: {
    [key: string]: string[][] | null
  };
  ships: {
    [key: string]: ShipType[] | null
  };
};

export type ShipType = {
  position: PositionXY;
  direction: boolean;
  length: number;
  type: SizeType;
};

export type AttackType =  {
  position: PositionXY,
  currentPlayer: number,
  status: StatusType,
}