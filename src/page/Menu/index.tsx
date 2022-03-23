import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomList from '../../component/RoomList';
import useUpdateRoomList from '../../utils/useUpdateRoomList';
import { loading, success, warning } from '../../utils/message';
import RoomHeader from '../../component/RoomHeader';
import RoomPanel from '../../component/RoomPanel';
import { getCurUser, getIsLogin } from '../../utils/functions';
import socket from '../../utils/socket';

socket.on('test', (data: any) => {
	console.log('test response', data);
})

const Menu: React.FC<{}> = () => {

	// const [roomName, setRoomName] = useState('');
	const [newRoomName, setNewRoomName] = useState('');
	const [myRoom, setMyRoom] = useState({} as GameRoom | undefined);
	const [roomPanelVsb, setRoomPanelVsb] = useState(false);
	const [roomList, setRoomList] = useUpdateRoomList(socket, [] as RoomInfo[]);
	// const [roomList, setRoomList] = useState([] as RoomInfo[]);

	const history = useNavigate();
	const isLogin = getIsLogin();
	const self = getCurUser();
	
	useEffect(() => {
		if (!isLogin) {
			history('/login');
		}
	}, [isLogin]);

	useEffect(() => {
		/*
			登陆后，进入 menu 页时创建 socket 连接，此时在前端给 auth 写入用户信息，后端就能在 client 参数中，
			通过 client.handshake.auth 获取断开连接的 player 对象.
		*/
		socket.auth = { user: self };
		socket.emit('connect-server', { data: 'new client' }, (data: RoomInfo[]) => {
			console.log(data);
			setRoomList(data);
		});
		socket.on('broadcast', (data: any) => {	//	仅注册一次的函数，写在这个hook中，不可写在全局，否则会注册多次
			// console.log('rec 广播', data);
			success(data.msg);
		})
		// socket.on('get-new-room-list', (data: RoomInfo[]) => {
		//     console.log('get-new-room-list', data);
		//     setRoomList(data);
		// });
	}, []);

	const updateRoomList = () => {
		socket.emit('update-roomlist');
	}

	// const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
	//     e.preventDefault();
	//     console.log(e);
	//     const input = e.target.value;
	//     console.log('input =', input);
	//     setRoomName(input);
	// }

	// const handleInputNew = (e: React.ChangeEvent<HTMLInputElement>) => {
	//     e.preventDefault();
	//     setNewRoomName(e.target.value);
	// }

	const handleJoinRoom = (roomName: string) => {
		console.log('join');
		console.log(socket);
		if (!roomName || roomName === '') {
			warning('请输入房间号')
			return;
		}
		const req: JoinRoomReq = { roomName, player: self }
		const key = 'join...';
		loading(key, key);
		socket.emit('joinRoom', req, (data: JoinRoomRes) => {
			if (!data.success) {
				warning(data.msg, key);
				return;
			}
			success(data.msg, key);
			console.log(data);
			updateRoomList();
			setMyRoom(data.room);
			setRoomPanelVsb(true);
		});
	}

	const handleCreateRoom = (newRoomName: string) => {
		console.log('create');
		const createRoomReq: CreateRoomReq = { roomName: newRoomName, owner: self };
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
			setMyRoom(data.room);
			updateRoomList();
			setRoomPanelVsb(true);
		});
	}

	const handleLeave = () => {
		const leaveRoomReq: LaveRoomReq = {
			player: self as Player,
			room: myRoom as GameRoom
		}
		socket.emit('leaveRoom', leaveRoomReq, (data: boolean) => {
			if (data) {
				setRoomPanelVsb(false);
			}
		});
	}

	const handleStart = (roomName: string) => {
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
			{/* <div>
                <input style={{ display: 'inline-block' }} value={newRoomName} onChange={handleInputNew} />
                <Button onClick={handleCreateRoom}> {'创建房间'} </Button>
            </div>
            <div>
                <Button onClick={handleStart}> {'开始'} </Button>
            </div>
            <div>
                <input style={{ display: 'inline-block' }} value={roomName} onChange={handleInput} />
                <Button style={{ display: 'inline-block' }} onClick={handleJoinRoom}> {'加入房间'} </Button>
            </div> */}
			<RoomHeader onCreateRoom={handleCreateRoom}></RoomHeader>
			<RoomList roomList={roomList} onJoinRoom={handleJoinRoom}></RoomList>
			<RoomPanel visible={roomPanelVsb} room={myRoom} onLeave={handleLeave}></RoomPanel>
		</div>
	</>
}

export default Menu;
