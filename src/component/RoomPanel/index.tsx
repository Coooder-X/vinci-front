import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { getCurUser, getIsLogin } from '../../utils/functions';
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
				<Button>
					{self?.name === room?.owner.name ? '开始游戏' : '准备'}
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