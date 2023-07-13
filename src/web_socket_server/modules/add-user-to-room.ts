import { users } from '../../data/users.js';
import { rooms } from '../../data/rooms.js';
import { createResponse } from '../../app/healpers.js';
import { CustomWebSocket } from '../../app/types.js';

const addUserToRoom = (ws: CustomWebSocket, data: string) => {
  const userId = ws.userId;
  const user = users.getById(userId);
  const { indexRoom } = JSON.parse(data);
  
  if (user) {
    const room = rooms.getById(indexRoom);
    room?.roomSockets.push(ws);
    room?.roomUsers.push({ name: user.name, index: userId })
    if(!room) return
    ws.room = room;

    room?.roomSockets.forEach((user) => {
      const resData = {
        idGame: room?.roomId,
        idPlayer: user.userId,
      };
      user.send(createResponse('create_game', resData));
    });


  }
};
export default addUserToRoom;
