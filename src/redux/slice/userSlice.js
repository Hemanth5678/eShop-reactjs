import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  account: {
    id: '',
    email: '',
    phone: '',
    address: '',
    firstName: '',
    lastName: '',
    role: '',
    status: '',
    createdAt: '',
    updateAt: '',
    accessToken: '',
    refreshToken: '',
  },
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserLoginSuccess: (state, action) => {
      state.account = {
        ...action.payload,
      };
      state.isAuthenticated = true;
    },
    updateInformationSlices: (state, action) => {
      state.account = {
        ...state.account,
        ...action.payload,
      };
    },
    removeDataUserLogout: (state) => {
      state.account = {
        ...initialState.account,
      };
      state.isAuthenticated = false;
    },
  },
});

export const { fetchUserLoginSuccess, removeDataUserLogout, updateInformationSlices } = userSlice.actions;

export default userSlice.reducer;
