import React, { useEffect, useState } from 'react';
import { Button, Card, Input, List, Modal } from 'antd';
import { io } from 'socket.io-client';
import socket from '../../utils/socket';
import './index.css';
import { error, success, warning } from '../../utils/message';


const RoomHeader: React.FC<RoomHeaderProps> = (props) => {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');

	const handleInputNew = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setNewRoomName(e.target.value);
	}

	const handleToggleCreate = () => {
		setIsModalVisible(!isModalVisible);
		setNewRoomName('');
	}

	const handleCancel = () => {
		setIsModalVisible(false);
		setNewRoomName('');
	}

	const handleCreateRoom = () => {
		if (newRoomName === '') {
			error('房间名不能为空！');
			return
		}
		props.onCreateRoom(newRoomName);
		setIsModalVisible(!isModalVisible);
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
					<Input
						// style={{ display: 'inline-block' }}
						value={newRoomName}
						autoFocus={true}
						onPressEnter={handleCreateRoom}
						onChange={handleInputNew} />
				</div>
			</Modal>
		</>
	)

}

interface RoomHeaderProps {
	onCreateRoom: Function;
}

export default RoomHeader;