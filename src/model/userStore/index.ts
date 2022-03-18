import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { error, success } from '../../utils/message';
import { userLogin } from './thunk';
import { UserState } from './types';

const initialState: UserState = {
  isLogin: false,
  player: {
    avatar: undefined,   //  头像
    name: '',
    id: '',
    socketId: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserAvatar: (state, action: PayloadAction<string>) => {
      //  TODO 更换用户头像
      state.player.avatar = action.payload;
    },
    logout: (state) => {
      state.player = {
        avatar: undefined,   //  头像
        name: '',
        id: '',
        socketId: '',
      };
      state.isLogin = false;
      sessionStorage.removeItem('userState');
    }
    // switchPage: (state, action: PayloadAction<string>) => {
    //   // state.page = action.payload;
    // },

    // focusRally: (state, action: PayloadAction<number>) => {
    //   // state.focus.rallyId = action.payload;
    // },
  },
  extraReducers: builder => {
    // builder.addCase(userLogin.fulfilled, (state: Draft<SysState>, action) => {
    //   state.networkStatus = { ...state.networkStatus, ...action.payload };
    // });
    // builder.addCase(userLogin.fulfilled, (state: Draft<UserState>, action: PayloadAction<User>) => {
    //   // state.saveState = action.payload;
    //   state.isLogin = true;
    // })
    builder.addCase(userLogin.fulfilled, (state: Draft<UserState>, { payload }) => {
      console.log('redux', payload);

      if (payload.data === '') {
        error('账号或密码错误!');
        return;
      }
      state.isLogin = true;
      state.player.name = payload.data.username;
      state.player.id = payload.data.uid;
      sessionStorage.setItem('userState', JSON.stringify(state));
      success('登陆成功~');
    });
  },
});

export const { actions: userActions, reducer: userReducer } = userSlice;

export * from './types';