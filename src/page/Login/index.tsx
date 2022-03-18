import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { useAppDispatch } from '../../model';
import { userLogin } from '../../model/userStore/thunk';
import { useSelector } from 'react-redux';
import { RootState } from '../../model';
import { getIsLogin } from '../../utils/functions';
import './index.css';

const Login: React.FC<{}> = () => {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const history = useNavigate();
	const dispatch = useAppDispatch();

	/*	第一次登陆时，根据 store 的 isLogin 变化，触发跳转
		在 menu 页刷新后，store 清空，sessionStorage 里还有，此时 isLogin 要通过 getIsLogin() 拿
	 */
	const isLogin = useSelector((state: RootState) => state.user.isLogin) || getIsLogin();
	useEffect(() => {	//	若登陆成功，一到 login 页面就重定向到 menu
		console.log('effect', isLogin);
		if (isLogin && sessionStorage.getItem('userState')) {
			console.log('islogin');
			history('/menu');
		}
	}, [isLogin]);

	const handleChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		// console.log(event.target.value);
		if (type === 'username')
			setUserName(event.target.value);
		else
			setPassword(event.target.value);
	}
	const handleLogin = () => {
		console.log('send ' + username);
		const param: User = { username, password };
		dispatch(userLogin(param));
		// axios.post('/api/login', param).then(response => {
		// 	console.log(response);
		// 	console.log('login res', response.data);
		// 	if (response.data === '') {
		// 		alert('账号或密码错误!');
		// 		return;
		// 	}
		// 	history('/menu');
		// }).catch(error => {
		// 	console.log(error);
		// })
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
