import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';
import RoomItem from '../RoomItem';

const RoomList: React.FC<RoomListProps> = (props) => {

	const handleJoinRoom = (roomName: string) => {
		return () => {
			props.onJoinRoom(roomName);
		}
	}

	return (
		<>
			{/* <List
				grid={{
					gutter: 36,
					xs: 1,
					sm: 3,
					md: 4,
					lg: 4,
					xl: 6,
					xxl: 7,
				}}
				dataSource={props.roomList}
				renderItem={room => (
					// <List.Item>
						<RoomItem
							roomName={room.name}
							roomOwnerName='player1'
							status='preparing'
							playerList={['asd']}
							onJoin={handleClickRoom} />
					// </List.Item>
					// <List.Item>
					// 	<Card onClick={handleClickRoom} title={room.name}>{room.name + '\n' + room.playerNum}</Card>
					// </List.Item>
				)}
			/> */}
			<div style={{
				position: 'absolute',
				backgroundColor: 'silver',
				// backgroundColor: '#fff17e',
				display: 'flex',
				flexWrap: 'wrap',
				width: '100%',
				height: '100%',
				padding: '30px',
			}}>
				{props.roomList.map(room => (
					<RoomItem
						key={room.name}
						roomName={room.name}
						roomOwnerName='player1'
						status='preparing'
						playerList={['asd']}
						onJoin={handleJoinRoom(room.name)} />
				))}
			</div>
		</>
	)
}

interface RoomListProps {
	roomList: RoomInfo[];
	onJoinRoom: Function;
}

export default RoomList;