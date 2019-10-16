import { createServer, Server } from 'http';
import { SocketController} from './controller';
import * as socketIo from 'socket.io';


export class SocketServer {
    public static readonly PORT:number = 1111;
    private controller: SocketController;
    private connection: Server;
    private server: SocketIO.Server;
    private port: string | number;

    constructor(){
        this.port = process.env.PORT || SocketServer.PORT;
        this.connection = createServer();
        this.server     = socketIo(this.connection);
        this.controller = new SocketController(this.server);
        this.listen();
    }

    private listen(): void {
        this.connection.listen(this.port, () => {
            console.log('Server listening at port %d', this.port);
        });
    }
}