import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const resetPasswordWithFirebase =
  ({ email }) =>
  async dispatch => {
    if (!firebaseService.auth) {
      console.warn("Firebase Service didn't initialize, check your configuration");
      return () => false;
    }
    return firebaseService.auth.sendPasswordResetEmail(email).catch(error => {
      const emailErrorCodes = [
        'auth/email-already-in-use',
        'auth/invalid-email',
        'auth/operation-not-allowed',
        'auth/user-not-found',
        'auth/user-disabled'
      ];
      const response = [];

      if (emailErrorCodes.includes(error.code)) {
        response.push({
          type: 'email',
          message: error.message
        });
      }
      if (error.code === 'auth/invalid-api-key') {
        dispatch(showMessage({ message: error.message }));
      }

      return dispatch(loginError(response));
    });
  };

const initialState = {
  success: false,
  errors: []
};

const resetSlice = createSlice({
  name: 'auth/reset',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    }
  },
  extraReducers: {}
});

export const { loginSuccess, loginError } = resetSlice.actions;

export default resetSlice.reducer;
