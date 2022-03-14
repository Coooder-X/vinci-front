import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register: React.FC<{}> = () => {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [againPassword, setAgainPassword] = useState('');
	const history = useNavigate();
	const handleChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (type === 'username')
			setUserName(value);
		else if (type === 'password')
			setPassword(value);
		else if (type === 'againPassword')
			setAgainPassword(value);
	}
	const handleRegister = () => {
		console.log('send ' + username);
		if (password !== againPassword) {
			alert('两次密码不同');
			setAgainPassword('');
			setPassword('');
			return;
		}
		const param = { username, password };
		axios.post('/api/register', param).then(response => {
			console.log(response);
			console.log('register res', response.data);
			if (response.data) {
				history('/login');
			} else {
				setUserName('');
				setAgainPassword('');
				setPassword('');
			}
		}).catch(error => {
			console.log(error);
		})
	}

	return <>
		<div>
			{'username'}
			<input onChange={handleChange('username')} value={username}></input>
		</div>
		<div>
			{'password'}
			<input onChange={handleChange('password')} value={password}></input>
		</div>
		<div>
			{'password agin'}
			<input onChange={handleChange('againPassword')} value={againPassword}></input>
		</div>
		<button onClick={handleRegister}>register</button>
	</>
}

export default Register;
