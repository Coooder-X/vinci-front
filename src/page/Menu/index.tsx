import React, { useState } from 'react';
import axios from "axios";

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
    }

    const handleCreateRoom = () => {
        console.log('create');
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
