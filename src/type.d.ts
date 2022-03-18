interface GameRoom {
    name: string;
    owner: Player;
    started: boolean;
    message: Map<string, string>;
    playerMap: Map<string, Player>;
}

interface CreateRoomReq {
    roomName: string;
}

interface Player {
    avatar?: any;   //  头像
    name: string;
    id: string;
    socketId: string;
}

interface User {
    username: string;
    password: string;
}

interface StartInfo {
    msg: string;
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

interface RoomInfo {
    name: string;
    started: boolean;
    playerNum: number;
    owner: Player;
    playerLst: Player[];
}