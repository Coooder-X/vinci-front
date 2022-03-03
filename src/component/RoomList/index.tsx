import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';

const RoomList: React.FC<RoomListProps> = (props) => {

	const handleClickRoom = () => {
		alert('add');
	}

	return (
		<List
			grid={{
				gutter: 16,
				xs: 1,
				sm: 2,
				md: 4,
				lg: 4,
				xl: 6,
				xxl: 3,
			}}
			dataSource={props.roomList}
			renderItem={room => (
				<List.Item>
					<Card onClick={handleClickRoom} title={room.name}>{room.name + '\n' + room.playerNum}</Card>
				</List.Item>
			)}
		/>
	)
}

interface RoomListProps {
	roomList: RoomInfo[];
}

export default RoomList;