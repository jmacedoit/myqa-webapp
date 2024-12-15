
/*
 * Module dependencies.
 */

import { AuthenticatedUser } from 'src/types/users';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/state/store';

/*
 * Authentication slice.
 */

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isAuthenticated: false,
    authenticatedUser: null as AuthenticatedUser | null
  },
  reducers: {
    authenticateUser: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.authenticatedUser = action.payload;
      state.isAuthenticated = true;
    },
    logOutUser: state => {
      state.authenticatedUser = null;
      state.isAuthenticated = false;
    }
  }
});

/*
 * Export actions, selector and reducer.
 */

export const { authenticateUser, logOutUser } = authenticationSlice.actions;

export const selectAuthenticatedUser = (state: RootState) => state.authentication.authenticatedUser;

export default authenticationSlice.reducer;

