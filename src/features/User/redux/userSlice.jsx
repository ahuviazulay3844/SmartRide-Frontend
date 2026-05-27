import { createSlice } from '@reduxjs/toolkit';
import { userApi } from './userApi';

const initialState = {
  token: localStorage.getItem('token') || null,
  currentUser: null,
  isAdmin: false 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      // עדכון ה-isAdmin במידה והפעולה נקראת ידנית
      state.isAdmin = action.payload?.userType === 1 || action.payload?.userType === 'Admin';
    },
    logout: (state) => {
      state.token = null;
      state.currentUser = null;
      state.isAdmin = false; 
      localStorage.removeItem('token');
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    // listener for successful login to store token and user data
    builder.addMatcher(
      userApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        const token = payload.token || payload; 
        const user = payload.user || null;

        state.token = token;
        localStorage.setItem('token', token);
        
        if (user) {
          state.currentUser = user;
          // update isAdmin based on userType after login
          state.isAdmin = user.userType === 1 || user.userType === 'Admin';
        }
      }
    );

    // listener for fetching current user (for handling page refresh F5)
    builder.addMatcher(
      userApi.endpoints.getCurrentUser.matchFulfilled,
      (state, { payload }) => {
        state.currentUser = payload;
        // verify admin status even after refresh
        state.isAdmin = payload?.userType === 1 || payload?.userType === 'Admin';
      }
    );
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;