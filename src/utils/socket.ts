import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:3020');
// socket.auth = {test:'dsfasfd'}
export default socket;
