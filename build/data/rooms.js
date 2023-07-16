let roomsData = [];
export const createId = () => {
    const allId = roomsData.map((room) => room.roomId);
    return allId.length > 0 ? Math.max(...allId) + 1 : 1;
};
export const get = () => {
    return roomsData;
};
export const getById = (id) => {
    return roomsData.find((room) => room.roomId === id);
};
export const create = (room) => {
    roomsData.push(room);
    return roomsData;
};
export const remove = (id) => {
    roomsData = roomsData.filter((room) => room.roomId !== id);
};
export const rooms = {
    createId,
    get,
    getById,
    create,
    remove,
};
//# sourceMappingURL=rooms.js.map