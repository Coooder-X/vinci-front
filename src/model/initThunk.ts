import { createAsyncThunk } from '@reduxjs/toolkit';
import { userLogin } from './userStore/thunk';

export const initThunk = createAsyncThunk(
  'initialize',
  async (arg, { dispatch }) => {
    // dispatch(userLogin());
  },
);
//  该文件暂时无用
