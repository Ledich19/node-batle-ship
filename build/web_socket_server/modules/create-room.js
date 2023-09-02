import { rooms } from '../../data/rooms.js';
import { users } from '../../data/users.js';
import { updateRoomsAndWinnersForAll } from '../helpers/responses.js';
const createRoom = (ws) => {
    const roomId = rooms.createId();
    const { userId } = ws;
    const user = users.getById(userId);
    if (!user)
        return;
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
        },
    };
    rooms.create(room);
    ws.room = room;
    updateRoomsAndWinnersForAll;
};
export default createRoom;
//# sourceMappingURL=create-room.js.map