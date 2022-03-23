type Svg = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
interface GameRoom {
    name: string;
    owner: Player;
    started: boolean;
    message: Map<string, string>;
    playerMap: Map<string, Player>;
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