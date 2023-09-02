import reg from './modules/reg.js';
import createRoom from './modules/create-room.js';
import addShips from './modules/add-ships.js';
import addUserToRoom from './modules/add-user-to-room.js';
import attack from './modules/attack.js';
import randomAttack from './modules/randomAttack.js';
import singlePlay from './modules/singlePlay.js';
const handleWebSocket = (ws) => {
    ws.on('error', console.error);
    ws.on('message', (data) => {
        const dataParsed = JSON.parse(data);
        console.log('TYPE:', dataParsed.type);
        const customWs = ws;
        if (dataParsed.type === 'reg') {
            reg(ws, dataParsed.data);
        }
        if (dataParsed.type === 'create_room') {
            createRoom(customWs);
        }
        if (dataParsed.type === 'add_ships') {
            addShips(customWs, dataParsed.data);
        }
        if (dataParsed.type === 'add_user_to_room') {
            addUserToRoom(customWs, dataParsed.data);
        }
        if (dataParsed.type === 'attack') {
            attack(customWs, dataParsed.data);
        }
        if (dataParsed.type === 'randomAttack') {
            randomAttack(customWs, dataParsed.data);
        }
        if (dataParsed.type === 'single_play') {
            singlePlay(customWs);
        }
        console.log('received: %s', data);
    });
    ws.send('something');
};
export default handleWebSocket;
//# sourceMappingURL=index.js.map