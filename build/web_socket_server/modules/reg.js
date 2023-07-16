import { users } from '../../data/users.js';
import { createResponse } from '../helpers/responses.js';
import { updateRoomsAndWinnersForAll } from '../helpers/responses.js';
const reg = (ws, data) => {
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
        resData.errorText = 'wrong password or this name already exists';
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
        resData.name = user.name;
        resData.index = user.id;
    }
    else {
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
    ws.userId = resData.index;
    ws.send(createResponse('reg', resData));
    updateRoomsAndWinnersForAll();
};
export default reg;
//# sourceMappingURL=reg.js.map