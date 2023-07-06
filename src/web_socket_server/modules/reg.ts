import WebSocket from 'ws';
import { users } from '../../data/users.js';

const reg = (ws: WebSocket & { userId: number }, data: string) => {

  const { name, password } = JSON.parse(data);
  const user = users.getByName(name);
  const resData = {
    name: name,
    index: 0,
    error: false,
    errorText: '',
  };
  if (user && user.password !== password) {
    resData.error = true;
    resData.errorText = 'this name already exists';
  }
  if (name.length < 5) {
    resData.error = true;
    resData.errorText = 'name minimum 5 characters';
  }
  if (password.length < 5) {
    resData.error = true;
    resData.errorText = 'password minimum 5 characters';
  }

if (user && user.password === password) {
    console.log(user);
    
    resData.name = user.name;
    resData.index = user.id;
  } else {
    const id = users.createId();
    const newUser = {
      id: id,
      name: name,
      password: password,
      wins: 0,
    };
    const createdUser = users.create(newUser);
    resData.name = createdUser.name;
    resData.index = createdUser.id;
  }

  const reqObj = {
    type: 'reg',
    data: JSON.stringify(resData),
    id: 0,
  };

  resData.index > 0 ? ws.userId : null;
  ws.send(JSON.stringify(reqObj));
};
export default reg;
