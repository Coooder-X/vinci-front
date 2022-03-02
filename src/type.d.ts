interface GameRoom {
    name: string;
    started: boolean;
    message: Map<string, string>;
    playerMap: Map<string, Player>;
}

interface CreateRoomReq {
    roomName: string;
}

interface Player {
    id: string;
    socketId: string;
}

interface StartInfo {
    msg?: string;
    enable: boolean;
}

interface JoinRoomRes {
    room?: GameRoom;
    msg: string;
    success: boolean;
}

interface CreateRoomRes {
    room?: GameRoom;
    msg: string;
    success: boolean;
}