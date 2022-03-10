import React, { useEffect, useState } from 'react';
import RoomItem from '../../component/RoomItem';

const Test: React.FC<{}> = (props) => {
	return (
		<div style={{
			position: 'absolute',
			backgroundColor: 'silver',
			// backgroundColor: '#fff17e',
			display: 'flex',
			width: '100%',
			height: '100%',
			padding: '30px',
		}}>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<RoomItem roomName='roomName'
					roomOwnerName='player1'
					status='preparing'
					playerList={['asd']}
					onJoin={()=>{}}
				></RoomItem>
				<RoomItem roomName='roomName1'
					roomOwnerName='player2'
					status='started'
					playerList={['retew', 'jomm']}
					onJoin={()=>{}}
				></RoomItem>
				<RoomItem roomName='roomName2'
					roomOwnerName='player3'
					status='preparing'
					playerList={['retew', 'jomm', '234', 'sadr2']}
					onJoin={()=>{}}
				></RoomItem>
			</div >
		</div>
	)
}

export default Test;