import fs from 'fs';
import { UserType } from '../app/types.js';
import { log } from 'console';

const USERS_DATA_FILE = new URL('usersData.json', import.meta.url);

let usersData: UserType[] = [];

const loadUsersData = () => {
  try {
    const data = fs.readFileSync(USERS_DATA_FILE, 'utf8');
    usersData = JSON.parse(data);
  } catch (error) {
    console.error('Failed to load users data:', error);
    usersData = [];
  }
};

const saveUsersData = () => {
  try {
    const data = JSON.stringify(usersData);
    fs.writeFileSync(USERS_DATA_FILE, data, 'utf8');
  } catch (error) {
    console.error('Failed to save users data:', error);
  }
};

export const createId = () => {
  loadUsersData();
  const allIds = usersData.map((player) => player.id);
  return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
};

export const get = (): UserType[] => {
  loadUsersData();
  return usersData;
};

export const getById = (id: number): UserType | undefined => {
  loadUsersData();
  return usersData.find((user) => user.id === id);
};
export const getByName = (name: string): UserType | undefined => {
  loadUsersData();
  return usersData.find((user) => user.name === name);
};

export const create = (user: UserType): UserType => {
  loadUsersData();
  usersData.push(user);
  log('usersData:', usersData);
  saveUsersData();
  return user;
};
export const setWinner = (userId: number): UserType | undefined => {
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
