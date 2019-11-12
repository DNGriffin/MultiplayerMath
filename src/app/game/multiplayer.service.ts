import * as io from 'socket.io-client';

export class MultiplayerService {
    private url = 'http://localhost:3000';
    private socket;    

    constructor() {
        this.socket = io(this.url);
    }
    public sendPosition(y) {

        this.socket.emit('sendPosition', y);
    }
    public seekPosition(){

    }
}