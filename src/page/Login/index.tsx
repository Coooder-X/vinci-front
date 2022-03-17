import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Button, Card } from 'antd';

const Login: React.FC<{}> = () => {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const history = useNavigate();
	const handleChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		// console.log(event.target.value);
		if (type === 'username')
			setUserName(event.target.value);
		else
			setPassword(event.target.value);
	}
	const handleLogin = () => {
		console.log('send ' + username);
		const param = { username, password };
		axios.post('/api/login', param).then(response => {
			console.log(response);
			console.log('login res', response.data);
			if (response.data === '') {
				alert('账号或密码错误!');
				return;
			}
			history('/menu');
		}).catch(error => {
			console.log(error);
		})
	}

	const handleRegister = () => {
		history('/register');
	}

	return <>
		<div className='login_item'>
			<Card>
				<div className='user_item'>
					{'username'}
					<input onChange={handleChange('username')} value={username}></input>
				</div>
				<div className='user_item'>
					{'password'}
					<input type="password" onChange={handleChange('password')} value={password}></input>
				</div>
				<Button onClick={handleLogin}>submmit</Button>
				<Button onClick={handleRegister}>register</Button>
			</Card>
		</div>
	</>
}

export default Login;
