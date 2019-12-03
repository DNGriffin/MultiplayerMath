import * as io from 'socket.io-client';

export class MultiplayerService {
    private url = 'https://ec2-3-136-112-3.us-east-2.compute.amazonaws.com:3000';
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