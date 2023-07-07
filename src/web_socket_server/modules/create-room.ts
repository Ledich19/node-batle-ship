import WebSocket from 'ws';
import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';

const createRoom = (ws: WebSocket & { userId: number }) => {
  const roomId = rooms.createId();
  const userId = ws.userId;
  const user = users.getById(userId);
  console.log(userId);
  
  if (!user) {
    return;
  }

  const room = {
    roomId: roomId,
    roomUsers: [
      {
        name: user.name,
        index: ws.userId,
        field: null,
      },
    ],
  };
  rooms.create(room);

  // const resData = JSON.stringify({
  //   idGame: roomId,
  //   idPlayer: userId,
  // });
  // const reqObj = {
  //   type: 'create_game',
  //   data: resData,
  //   id: 0,
  // };
  // ws.send(JSON.stringify(reqObj));

  console.log('CREATE_ROOM:');
};
export default createRoom;
