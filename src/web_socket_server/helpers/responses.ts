import { ResponseType } from "../../app/types.js";
import { rooms } from "../../data/rooms.js";
import { users } from "../../data/users.js";
import { wss } from "../../server.js";

export const createResponse = <T>(type: ResponseType, data: T): string => {
  const response = {
    type: type,
    data: JSON.stringify(data),
    id: 0,
  };
  return JSON.stringify(response);
};

export const updateRoomsAndWinnersForAll = () => {
  const roomsWithOnePlayer = rooms.get()
    .filter((room) => room.roomUsers.length == 1)
    .map((room) => ({ roomId: room.roomId, roomUsers: room.roomUsers }));

    const winners = users.get().map((user) => ({ name: user.name, wins: user.wins }));

    wss.clients.forEach((client) => {
      client.send(createResponse('update_winners', winners));
      client.send(createResponse('update_room', roomsWithOnePlayer));
    });
}

