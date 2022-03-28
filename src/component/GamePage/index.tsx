import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getCurUser } from '../../utils/functions';
import { success } from '../../utils/message';
import socket from '../../utils/socket';
import BigCardContainer from '../BigCardContainer';

const GamePage: React.FC<{}> = (props) => {

	const [gameRoom, setGameRoom] = useState({} as GameRoom);
	const [turnIdx, setTurnIdx] = useState(0);
	const [gameRoomS, setGameRoomS] = useState({} as GameRoomSerializ);
	// const location = useLocation();
	// const roomName = location.state;
	const param = useParams();
	const roomName = param.roomName;
	console.log('gamepage', roomName);
	const curUser = getCurUser();

	useEffect(() => {
		socket.on('get-turns-info', (data: any) => {	//	接受服务端指示的出牌轮次广播
			console.log('get-turns-info', data);
			setTurnIdx(data.curIndex);
			success('你的回合！');	//	此后改为 BigHint 组件显示
		});
		socket.emit('get-room-obj', roomName, (data: GameRoomSerializ) => {
			console.log(data);
			setGameRoomS(data);
			//	此时房间内的每个玩家都获得了序列化的 GameRoom 对象，然后房主需要通知后台，让其发送玩家出牌轮次
			if (curUser?.id === data.owner.id) {
				socket.emit('qurey-turns-info', roomName);
			}
		});
	}, []);

	const notifyNext = () => {
		socket.emit('notifyNext', {
			idx: turnIdx,
			roomSize: gameRoomS.playerLst.length,
			roomName: gameRoomS.name
		});
	};

	return <>
		<div>
			{/* {gameRoomS.playerLst && gameRoomS.playerLst.map((player, idx) => (
				<div
					key={player.id}
					style={{
						display: 'inline-block',
						marginLeft: '20px',
						backgroundColor: idx === turnIdx ? 'green' : 'white',
						padding: '10px'
					}}>
					{player.name}
					<Button onClick={notifyNext}>
						{'下一个'}
					</Button>
				</div>
			))} */}
			<BigCardContainer></BigCardContainer>
		</div>
	</>
}

export default GamePage;