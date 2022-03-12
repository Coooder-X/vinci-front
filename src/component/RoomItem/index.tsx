import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Divider, List, Space, Tooltip } from 'antd';
import { HomeOutlined, HomeTwoTone } from '@ant-design/icons';
import './index.css';
// import './index.less';

const totalNum = 4;

const RoomItem: React.FC<RoomProps> = (props) => {

	const handleJoin = () => {
		props.onJoin(props.roomName);
	}

	const trans = () => {
		return props.status === 'preparing' ? "未开始" : "游戏中...";
	}

	return (
		<Badge.Ribbon text={trans()} color={props.status === 'preparing' ? "green" : "orange"}>
			<div className='room-item'>
				<Space>
					<HomeTwoTone />
					{props.roomName}
				</Space>
				<div className='player-num'>{`人数：${props.playerList.length}/${totalNum}`}</div>
				<Divider />
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div className='room-owner'>
						<div style={{ marginLeft: '10px', lineHeight: '30px', fontSize: '12px' }}> {'房主：'} </div>
						<Tooltip placement="bottom" title={props.roomOwnerName}>
							<Avatar src="https://joeschmoe.io/api/v1/random" />
							{/* <Avatar>{'A'}</Avatar>	添加名字长度限制 */}
						</Tooltip>
						{/* <div style={{ marginLeft: '10px', lineHeight: '30px' }}> {props.roomOwnerName} </div> */}
					</div>
					<Button style={{ marginLeft: '10px', marginRight: '10px' }}
						type='primary'
						size='small'
						onClick={handleJoin}
						disabled={props.playerList.length === totalNum ? true : props.status === 'preparing' ? false : true}>
						{'加入游戏'}
					</Button>
				</div>
				<div className='player-list'>
					<div style={{ lineHeight: '30px', fontSize: '12px', marginRight: '5px' }}>{'玩家列表:'}</div>
					{props.playerList.map((player: any) => {
						return (
							<Tooltip placement="bottom" title={player} key={player}>
								<Avatar className='player-advatar' size={30}>{player}</Avatar>
							</Tooltip>
						)
					})}
				</div>
			</div>
		</Badge.Ribbon>
	)
}

interface RoomProps {
	roomName: string;
	roomOwnerName: string;	//	之后改为 player 对象，包含头像信息
	status: 'preparing' | 'started';
	playerList: any[];
	onJoin: Function;
}

export default RoomItem;