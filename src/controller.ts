import {GameEvent} from './constants';

export class SocketController {
    private server: SocketIO.Server;

    constructor(server: SocketIO.Server) {
        this.server = server;
        this.listen();
    }

    private listen(): void {
        let users: any = {}, id = 0;
        let createUserId = () => ++id;

        this.server.on(GameEvent.CONNECT, (socket: any) => {
            let addedUser = false;
            console.log("User Connected!");

            socket.emit(GameEvent.CONNECTED);

            socket.on(GameEvent.JOIN_GAME, (username: any) => {
                console.log(username);
                if (addedUser) return;

                const user = {
                    "Character": {
                        "UserId": 0,
                        "MaxHealth": 10.0,
                        "Damage": 4.0,
                        "Position": { "x": 30.4, "y": 3.6, "z": -11.9 },
                        "Rotation": { "x": 0, "y": 0, "z": 0, "w": 1 },
                        "CurrentHealth": { "Value": 10.0, "HasValue": true }
                    },
                    "Id": createUserId(),
                    "Name": username
                }

                users[user.Id] = user;
                socket.user = user;
                addedUser = true;

                socket.emit(GameEvent.USER_DATA, user);
                socket.emit(GameEvent.COMBAT_ROOM_DATA, Object.keys(users).map(k => users[k]));

                // echo globally (all clients exept me) that a person has connected
                socket.broadcast.emit(GameEvent.NEW_USER_JOINED, user);
            });

            socket.on(GameEvent.MOVE_CHARACTER, (data: any) => {
                if (users[data.UserId]) {
                    /*const pos = users[data.UserId].Character.Position;
                    pos.x += data.Position.x * 0.03 * 5;
                    pos.y += data.Position.y * 0.03 * 5;
                    pos.z += data.Position.z * 0.03 * 5;*/
                    users[data.UserId].Character.Position = data.Position;
                }
                //this.server.sockets.emit(GameEvent.CHARACTER_MOVED, data);
                socket.broadcast.emit(GameEvent.CHARACTER_MOVED, data);     //sends to all except me
            });

            socket.on(GameEvent.ROTATE_CHARACTER, (data: any) => {
                this.server.sockets.emit(GameEvent.CHARACTER_ROTATED, data);
                //socket.broadcast.emit('character_rotated', data);    //sends to all except me
            });

            socket.on(GameEvent.FIRE_GUN_CHARACTER, (data: any) => {
                this.server.sockets.emit(GameEvent.CHARACTER_FIRED_GUN, data);
            });

            socket.on(GameEvent.TAKE_DAMAGE_CHARACTER, (data: any) => {
                this.server.sockets.emit(GameEvent.CHARACTER_TAKEN_DAMAGE, data);
            });

            socket.on(GameEvent.DISCONNECT, () => {
                if (addedUser) {
                    delete users[socket.user.Id];
                    socket.broadcast.emit(GameEvent.USER_LEFT_GAME, socket.user.username);
                }
            });
        });
    }
}

