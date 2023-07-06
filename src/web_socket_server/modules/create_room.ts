import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';

const createRoom = (ws: WebSocket & { userId: number }, data: string) => {
  const FiALD_SIZE = 10;
  const roomId = rooms.createId();
  const userId = ws.userId;
  const user = users.getById(userId);
  if (!user) {
    return;
  }

  const room = {
    roomId: roomId,
    roomUsers: [
      {
        name: user.name,
        index: ws.userId,
        field: Array(FiALD_SIZE).fill(Array(FiALD_SIZE).fill(0)),
      },
    ],
  };
  rooms.create(room);

  const resData = JSON.stringify({
    idGame: roomId,
    idPlayer: userId,
  });
  const reqObj = {
    type: 'create_game',
    data: resData,
    id: 0,
  };

  console.log('CREATE_ROOM:');
  console.log(ws.userId);
  ws.send(JSON.stringify(reqObj));
};
export default createRoom;
