import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameState } from '../../utils/GameState';
import { getCurUser } from '../../utils/functions';
import { success } from '../../utils/message';
import socket from '../../utils/socket';
import BigCardContainer from '../BigCardContainer';

const GamePage: React.FC<{}> = (props) => {

	const [turnIdx, setTurnIdx] = useState(-1);
	const [gameRoomS, setGameRoomS] = useState({} as GameRoomSerializ);
	const [gameState, setGameState] = useState(GameState.INIT_CARD);
	const [restCardInfo, setRestCardInfo] = useState({blackRest: 13, whiteRest: 13} as RestCardInfo)

	const param = useParams();
	const roomName = param.roomName;
	console.log('gamepage', roomName);
	const curUser = getCurUser();

	useEffect(() => {
		socket.on('get-turns-info', (data: any) => {	//	接受服务端指示的出牌轮次广播
			console.log('get-turns-info', data);
			setTurnIdx(data.curIndex);
		});
		socket.emit('get-room-obj', roomName, (data: GameRoomSerializ) => {
			console.log(data);
			setGameRoomS(data);
		});
	}, []);

	useEffect(() => {
		if (gameState === GameState.INIT_CARD) {
			console.log('init');
			socket.emit('getRestCardInfo', roomName, (data: RestCardInfo) => {
				setRestCardInfo(data);
				console.log('setRestCardInfo', data);
			});
		} else if (gameState === GameState.FINISH_INIT) {
			setTimeout(finishInitCard, 2500);	//	通知服务端所有人已经结束开局摸牌
		} else if (gameState === GameState.GET_CARD) {
			socket.emit('getRestCardInfo', roomName, (data: RestCardInfo) => {
				setRestCardInfo(data);
				console.log('setRestCardInfo', data);
			});
		} else if (gameState === GameState.FINISH_CET_CARD) {
			setTimeout(notifyNext, 2500);	//	通知服务端通知下一个玩家
		}
	}, [gameState]);

	useEffect(() => {
		if (turnIdx === -1) return;
		if (gameRoomS.playerLst && gameRoomS.playerLst[turnIdx].id === curUser?.id) {
			console.log('你的回合');
			success('你的回合！');	//	此后改为 BigHint 组件显示
			setGameState(GameState.GET_CARD);
		}
	}, [turnIdx, gameRoomS]);

	const finishInitCard = () => {
		socket.emit('finishGetCard', gameRoomS.name);
		setGameState(GameState.WAITING);
	}

	/**
	 * on 开头的关于游戏状态的函数，都是传给子组件，子组件执行完当前状态逻辑后，通知本组件改变游戏状态
	 */
	const onFinishInitCard = () => {
		setGameState(GameState.FINISH_INIT);
	}

	const onFinishGetCard = () => {
		setGameState(GameState.FINISH_CET_CARD);
	}

	const notifyNext = () => {
		socket.emit('notifyNext', {
			idx: turnIdx,
			roomSize: gameRoomS.playerLst.length,
			roomName: gameRoomS.name
		});
	};

	return <>
		<div>
			{gameRoomS.playerLst && gameRoomS.playerLst.map((player, idx) => (
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
			))}
			<BigCardContainer
				playerId={curUser?.id}
				roomName={roomName}
				onFinishInitCard={onFinishInitCard}
				onFinishGetCard={onFinishGetCard}
				gameState={gameState}
				restCardInfo={restCardInfo}>
			</BigCardContainer>
		</div>
	</>
}

export default GamePage;