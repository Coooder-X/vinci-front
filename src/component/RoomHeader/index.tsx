import React, { useEffect, useState } from 'react';
import { Button, Card, List, Modal } from 'antd';
import { io } from 'socket.io-client';
import './index.css';
import { success, warning } from '../../utils/message';

const socket = io('http://localhost:3020');

const RoomHeader: React.FC<{}> = (props) => {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');

	const handleInputNew = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setNewRoomName(e.target.value);
	}

	const handleToggleCreate = () => {
		setIsModalVisible(!isModalVisible);
	}

	const handleCancel = () => {
		setIsModalVisible(false);
	}

	const updateRoomList = () => {
		socket.emit('update-roomlist');
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

	return (
		<>
			<div className='room-header'>
				{'123'}
				<Button onClick={handleToggleCreate}>{'创建房间'}</Button>
			</div>
			<Modal title="创建房间" visible={isModalVisible} onOk={handleCreateRoom} onCancel={handleCancel}>
				<div>
					<label>{'房间名：'}</label>
					<input style={{ display: 'inline-block' }} value={newRoomName} onChange={handleInputNew} />
					{/* <Button onClick={handleCreateRoom}> {'创建房间'} </Button> */}
				</div>
			</Modal>
		</>
	)

}

export default RoomHeader;