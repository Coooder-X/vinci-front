import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";

const socket = io('http://localhost:3020');
socket.on('broadcast', (data: any) => {
    // console.log('rec 广播', data);
    alert(data.msg);
})

socket.on('test', (data: any) => {
    console.log('test response', data);
})

const Menu: React.FC<{}> = () => {

    const [roomName, setRoomName] = useState('');
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        socket.emit('connect-server', { data: 'new client' });
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e);
        const input = e.target.value;
        console.log('input =', input);
        setRoomName(input);
    }

    const handleInputNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewRoomName(e.target.value);
    }

    const handleJoinRoom = () => {
        console.log('join');
        console.log(socket);
        if (!roomName || roomName === '') {
            alert('请输入房间号')
            return;
        }
        socket.emit('joinRoom', roomName, (data: JoinRoomRes) => {
            alert(data.msg);
            if (!data.success) {
                return;
            }
            console.log(data);
        });
    }

    const handleCreateRoom = () => {
        console.log('create');
        const createRoomReq: CreateRoomReq = { roomName: newRoomName };
        socket.emit('createRoom', createRoomReq, (data: CreateRoomRes) => {
            //  TODO room data 存入 redux
            alert(data.msg);
            if (data.success) {
                ;//
            } else {
                console.log(data);
                return;
            }
            console.log(data);
        });
    }

    const handleStart = () => {
        console.log('handleStart');
        if (!roomName || roomName === '') {
            alert('请先加入或创建房间');
            return;
        }
        socket.emit('handleStart', { roomName }, (data: StartInfo) => {
            console.log(data);
            alert(data.msg);
            if (data.enable) {
                //  start
            } else {
                //  error, can not start
            }
        });
    }

    return <>
        <div>
            <div>
                <input style={{ display: 'inline-block' }} value={newRoomName} onChange={handleInputNew} />
                <button onClick={handleCreateRoom}> {'创建房间'} </button>
            </div>
            <div>
                <button onClick={handleStart}> {'开始'} </button>
            </div>
            <div>
                <input style={{ display: 'inline-block' }} value={roomName} onChange={handleInput} />
                <button style={{ display: 'inline-block' }} onClick={handleJoinRoom}> {'加入房间'} </button>
            </div>
        </div>
    </>
}

export default Menu;
