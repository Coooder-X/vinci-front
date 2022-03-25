import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { getCurUser, getIsLogin } from '../../utils/functions';
import { success, warning } from '../../utils/message';
import socket from '../../utils/socket';

const RoomPanel: React.FC<RoomPanelProps> = (props) => {

	const { visible, room, onLeave } = props;
	const [ready, setReady] = useState(false);
	const self = getCurUser();
	const isLogin = getIsLogin();

	console.log('self room', self, room);

	if (room?.name && isLogin)
		console.log('check', self?.name, room?.owner.name);

	const handleLeave = () => {
		onLeave();
	}

	const handleStart = () => {
		//	若是普通玩家，每次点击是取消准备或准备，若是房主，则每次都是游戏开始
		const roomName = room?.name as string;
		console.log('handleStart');
		// if (self?.id !== room?.owner.id)	//	此处的 setReady 并没有同步立即执行，导致发送请求的 ready 还是旧值
		// 	setReady(!ready);
		// else
		// 	setReady(true);
		// console.log('ready', ready);
		const startReq: StartReq = { roomName, isOwner: self?.id === room?.owner.id, ready: !ready };
		socket.emit('handleStart', startReq, (data: StartInfo) => {
			console.log(data);
			if (self?.id === room?.owner.id) {
				setReady(true);
				if (data.enable) {
					success(data.msg);
					//	向后端发送开始请求（todo：后端收到后加锁，使玩家不能退出？没必要，请求后直接跳转）

				} else
					warning(data.msg);
			} else {
				setReady(!ready);
			}
		});
	}


	return <>
		{ room?.name && isLogin &&
			<Modal
				closable={false}
				centered={true}
				mask={true}
				maskClosable={false}
				keyboard={false}
				visible={visible}
				title={`房间：${room?.name}`}
				footer={null}
				width={'50%'}>
				<Button onClick={handleStart}>
					{self?.name === room?.owner.name ? '开始游戏' : ready? '已准备' : '准备'}
				</Button>
				<Button onClick={handleLeave}>
					{'退出房间'}
				</Button>
			</Modal>
		}
	</>
}

interface RoomPanelProps {
	visible: boolean;
	room: GameRoom | undefined;
	onLeave: Function;
}

export default RoomPanel;