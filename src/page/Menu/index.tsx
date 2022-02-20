import React, { useState } from 'react';
import{ io } from 'socket.io-client';
import axios from "axios";

const socket = io('http://localhost:3020/room');

const Menu: React.FC<{}> = () => {

    const [roomId, setRoomId] = useState('');

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e);
        const input = e.target.value;
        console.log('input =', input);
        setRoomId(input);
    }

    const handleJoinRoom = () => {
        console.log('join');
        console.log(socket);
        socket.emit('event', { data: '1234234243' }, (data: any) => console.log(data));
    }

    const handleCreateRoom = () => {
        console.log('create');
        socket.emit('message', { data: 'this is data', value: 123 }, (data: any) => console.log(data));
    }

    return <>
        <div>
            <button onClick={handleCreateRoom}> {'创建房间'} </button>
            <div>
                <input style={{ display: 'inline-block' }} value={roomId} onChange={handleInput} />
                <button style={{ display: 'inline-block' }} onClick={handleJoinRoom}> {'加入房间'} </button>
            </div>
        </div>
    </>
}

export default Menu;
