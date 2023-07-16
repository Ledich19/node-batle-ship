import fs from 'fs';
import { log } from 'console';
const USERS_DATA_FILE = new URL('usersData.json', import.meta.url);
let usersData = [];
const loadUsersData = () => {
    try {
        const data = fs.readFileSync(USERS_DATA_FILE, 'utf8');
        usersData = JSON.parse(data);
    }
    catch (error) {
        console.error('Failed to load users data:', error);
        usersData = [];
    }
};
const saveUsersData = () => {
    try {
        const data = JSON.stringify(usersData);
        fs.writeFileSync(USERS_DATA_FILE, data, 'utf8');
    }
    catch (error) {
        console.error('Failed to save users data:', error);
    }
};
export const createId = () => {
    loadUsersData();
    const allIds = usersData.map((player) => player.id);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
};
export const get = () => {
    loadUsersData();
    return usersData;
};
export const getById = (id) => {
    loadUsersData();
    return usersData.find((user) => user.id === id);
};
export const getByName = (name) => {
    loadUsersData();
    return usersData.find((user) => user.name === name);
};
export const create = (user) => {
    loadUsersData();
    usersData.push(user);
    log('usersData:', usersData);
    saveUsersData();
    return user;
};
export const setWinner = (userId) => {
    loadUsersData();
    const user = usersData.find((user) => user.id === userId);
    if (!user) {
        return;
    }
    user.wins = user.wins + 1;
    saveUsersData();
    return user;
};
export const users = {
    createId,
    get,
    getById,
    getByName,
    create,
    setWinner,
};
//# sourceMappingURL=users.js.map