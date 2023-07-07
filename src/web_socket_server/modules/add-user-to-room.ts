import WebSocket from 'ws';
import { users } from '../../data/users.js';
import { rooms } from '../../data/rooms.js';
import { wss } from '../../index.js';

type CustomWebSocket = WebSocket & { userId: number };

const addUserToRoom = (ws: WebSocket & { userId: number }, data: string) => {
  const userId = ws.userId;
  const user = users.getById(userId);
  const { indexRoom } = JSON.parse(data);
  if (user) {
    const room = rooms.add({ name: user.name, index: user.id }, indexRoom);
    const playersId = room?.roomUsers.map((user) => user.index);

    console.log('room', room);
    

    wss.clients.forEach((client) => {
      const customClient = client as CustomWebSocket;
      if (client.readyState === WebSocket.OPEN && playersId?.includes(customClient.userId)) {
        console.log('customClient------', customClient.userId);

        const resData = JSON.stringify({
          idGame: room?.roomId,
          idPlayer: customClient.userId,
        });
        const reqObj = {
          type: 'create_game',
          data: resData,
          id: 0,
        };
        client.send(JSON.stringify(reqObj));
      }
    });
  }
};
export default addUserToRoom;
