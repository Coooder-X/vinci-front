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

    const [roomId, setRoomId] = useState('');
    const [newRoomId, setNewRoomId] = useState('');

    useEffect(() => {
        socket.emit('connect-server', { data: 'new client' });
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e);
        const input = e.target.value;
        console.log('input =', input);
        setRoomId(input);
    }

    const handleInputNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewRoomId(e.target.value);
    }

    const handleJoinRoom = () => {
        console.log('join');
        console.log(socket);
        if (!roomId || roomId === '') {
            alert('请输入房间号')
            return;
        }
        socket.emit('joinRoom', { roomId }, (data: any) => {
            if (!data) {
                alert('房间可能已存在！')
            } else if (data.hasOwnProperty('msg')) {
                alert(data.msg);
            }
            console.log(data);
        });
    }

    const handleCreateRoom = () => {
        console.log('create');
        socket.emit('createRoom', { roomName: newRoomId }, (data: any) => {
            if (data) {
                alert('创建成功');
            } else {
                console.log(data);
                alert('创建失败，请换一个房间名');
            }
            console.log(data);
        });
    }

    const handleStart = () => {
        console.log('handleStart');
        if (!roomId || roomId === '') {
            alert('请先加入或创建房间');
            return;
        }
        socket.emit('handleStart', { roomId }, (data: any) => {
            console.log(data);
            if (data.enable) {
                //  start
            } else {
                alert(data.msg);
            }
        });
    }

    return <>
        <div>
            <div>
                <input style={{ display: 'inline-block' }} value={newRoomId} onChange={handleInputNew} />
                <button onClick={handleCreateRoom}> {'创建房间'} </button>
            </div>
            <div>
                <button onClick={handleStart}> {'开始'} </button>
            </div>
            <div>
                <input style={{ display: 'inline-block' }} value={roomId} onChange={handleInput} />
                <button style={{ display: 'inline-block' }} onClick={handleJoinRoom}> {'加入房间'} </button>
            </div>
        </div>
    </>
}

export default Menu;
