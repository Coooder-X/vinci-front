import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userLogin = createAsyncThunk(
	'userLogin',
	async (user: User) => {
		const response = await axios.post('/api/login', user);
		return response;
	},
)