import { users } from '../../data/users.js';
import { rooms } from '../../data/rooms.js';
import { createResponse } from '../helpers/responses.js';
const addUserToRoom = (ws, data) => {
    const userId = ws.userId;
    const user = users.getById(userId);
    const { indexRoom } = JSON.parse(data);
    if (user) {
        const room = rooms.getById(indexRoom);
        room === null || room === void 0 ? void 0 : room.roomSockets.push(ws);
        room === null || room === void 0 ? void 0 : room.roomUsers.push({ name: user.name, index: userId });
        if (!room)
            return;
        ws.room = room;
        room === null || room === void 0 ? void 0 : room.roomSockets.forEach((user) => {
            const resData = {
                idGame: room === null || room === void 0 ? void 0 : room.roomId,
                idPlayer: user.userId,
            };
            user.send(createResponse('create_game', resData));
        });
    }
};
export default addUserToRoom;
//# sourceMappingURL=add-user-to-room.js.map