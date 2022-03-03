import { Dispatch, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const useUpdateRoomList = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    init: RoomInfo[]
): [RoomInfo[], Dispatch<React.SetStateAction<RoomInfo[]>>] => {

    const [roomList, setRoomList] = useState(init);
    console.log('hook');    //  这样自定义 hook，每次页面变化都会调用（例如输入），可能并不是正确的封装

    //  这个封装仅仅是相当于在 useState 时，添加了一个订阅动作，之所以和这个state绑定，是因为订阅回调中需要这个 set 函数
    useEffect(() => {  
        socket.on('get-new-room-list', (data: RoomInfo[]) => {
            console.log(data);
            setRoomList(data);
        });
    }, []);
    return [roomList, setRoomList];
}

export default useUpdateRoomList;