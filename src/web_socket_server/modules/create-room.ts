import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';
import { wss } from '../../index.js';
import { createResponse } from '../../app/healpers.js';

const createRoom = (ws: WebSocket & { userId: number }) => {
  const roomId = rooms.createId();
  const userId = ws.userId;
  const user = users.getById(userId);

  
  if (!user) {
    return;
  }

  const room = {
    currentPlayer: ws.userId,
    roomId: roomId,
    roomUsers: [
      {
        name: user.name,
        index: ws.userId,
        field: null,
      },
    ],
  };
  const roomsData = rooms.create(room);

  const roomsWithOnePlayer = roomsData.filter((room) => room.roomUsers.length == 1);
  wss.clients.forEach((client) => {
    client.send(createResponse('update_room', roomsWithOnePlayer));
  });

};
export default createRoom;
