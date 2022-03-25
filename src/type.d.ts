type Svg = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
interface GameRoom {
    name: string;
    owner: Player;
    started: boolean;
    readyNum: number;
    message: Map<string, string>;
    playerMap: Map<string, Player>;
}

interface GameRoomSerializ {
    name: string;
    owner: Player;
    started: boolean;
    readyNum: number;
    message: Array<Message>;
    playerLst: Array<Player>;
}

interface Message {
    playerName: string;
    msg: string;
}

interface CreateRoomReq {
    roomName: string;
    owner: Player | undefined;
}

interface JoinRoomReq {
    roomName: string;
    player: Player | undefined;
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

interface LaveRoomReq {
    player: Player;
    room: GameRoom;
}

interface StartReq {
    roomName: string;
    isOwner: boolean;
    ready: boolean;
}

interface RoomInfo {
    name: string;
    started: boolean;
    playerNum: number;
    owner: Player;
    playerLst: Player[];
}

interface Size {
    width: number;
    height: number;
}

interface Card {
    num: string;
    isBlack: Boolean;
}