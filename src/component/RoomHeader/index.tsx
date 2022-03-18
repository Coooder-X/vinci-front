import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { error } from '../../utils/message';
import { useAppDispatch } from '../../model';
import { userActions } from '../../model/userStore';
import { useNavigate } from 'react-router-dom';
import { getCurUser } from '../../utils/functions';
import './index.css';


const RoomHeader: React.FC<RoomHeaderProps> = (props) => {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');

	const history = useNavigate();
	const dispatch = useAppDispatch();
	const curUser = getCurUser();

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

	const handleLogout = () => {
		dispatch(userActions.logout());
		history('/login');
	}

	return (
		<>
			<div className='room-header'>
				{ curUser? curUser.player.name : '' }
				<Button onClick={handleToggleCreate}>{'创建房间'}</Button>
				<Button onClick={handleLogout}>{'退出登陆'}</Button>
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