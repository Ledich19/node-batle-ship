import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';
import { wss } from '../../index.js';
import { createResponse } from '../../app/healpers.js';
import { CustomWebSocket } from '../../app/types.js';

const createRoom = (ws: CustomWebSocket) => {
  const roomId = rooms.createId();
  const { userId } = ws;
  const user = users.getById(userId);

  if (!user) {
    return;
  }

  const room = {
    currentPlayer: userId,
    roomId: roomId,
    roomUsers: [{ name: user.name, index: userId }],
    roomSockets: [ws],
    fields: {
      userId: null,
    },
    ships: {
      userId: null,
    }
  };

  const roomsData = rooms.create(room);
  ws.room = room;

  const roomsWithOnePlayer = roomsData
    .filter((room) => room.roomUsers.length == 1)
    .map((room) => ({ roomId: room.roomId, roomUsers: room.roomUsers }));

  wss.clients.forEach((client) => {
    client.send(createResponse('update_room', roomsWithOnePlayer));
  });
};
export default createRoom;
