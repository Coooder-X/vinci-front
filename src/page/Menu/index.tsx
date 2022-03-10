import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";
import RoomList from '../../component/RoomList';
import { Button } from 'antd';
import useUpdateRoomList from '../../utils/useUpdateRoomList';
import { loading, success, warning } from '../../utils/message';
import RoomHeader from '../../component/RoomHeader';
import socket from '../../utils/socket';

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
    const [roomList, setRoomList] = useUpdateRoomList(socket, [] as RoomInfo[]);
    // const [roomList, setRoomList] = useState([] as RoomInfo[]);

    useEffect(() => {
        socket.emit('connect-server', { data: 'new client' }, (data: RoomInfo[]) => {
            console.log(data);
            setRoomList(data);
        });
        // socket.on('get-new-room-list', (data: RoomInfo[]) => {
        //     console.log('get-new-room-list', data);
        //     setRoomList(data);
        // });
    }, []);

    const updateRoomList = () => {
        socket.emit('update-roomlist');
    }

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
            warning('请输入房间号')
            return;
        }
        const key = 'join...';
        loading(key, key);
        socket.emit('joinRoom', roomName, (data: JoinRoomRes) => {
            if (!data.success) {
                warning(data.msg, key);
                return;
            }
            success(data.msg, key);
            console.log(data);
            updateRoomList();
        });
    }

    const handleCreateRoom = () => {
        console.log('create');
        const createRoomReq: CreateRoomReq = { roomName: newRoomName };
        socket.emit('createRoom', createRoomReq, (data: CreateRoomRes) => {
            //  TODO room data 存入 redux
            // alert(data.msg);
            if (data.success) {
                success(data.msg);
                //
            } else {
                console.log(data);
                warning(data.msg);
                return;
            }
            console.log(data);
            updateRoomList();
        });
    }

    const handleStart = () => {
        console.log('handleStart');
        if (!roomName || roomName === '') {
            warning('请先加入或创建房间');
            return;
        }
        socket.emit('handleStart', { roomName }, (data: StartInfo) => {
            console.log(data);
            // alert(data.msg);
            if (data.enable) {
                success(data.msg);//  start
            } else {
                warning(data.msg);
                //  error, can not start
            }
        });
    }

    return <>
        <div>
            <div>
                <input style={{ display: 'inline-block' }} value={newRoomName} onChange={handleInputNew} />
                <Button onClick={handleCreateRoom}> {'创建房间'} </Button>
            </div>
            <div>
                <Button onClick={handleStart}> {'开始'} </Button>
            </div>
            <div>
                <input style={{ display: 'inline-block' }} value={roomName} onChange={handleInput} />
                <Button style={{ display: 'inline-block' }} onClick={handleJoinRoom}> {'加入房间'} </Button>
            </div>
            <RoomHeader></RoomHeader>
            <RoomList roomList={roomList}></RoomList>
        </div>
    </>
}

export default Menu;
