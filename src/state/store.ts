
/*
 * Module dependencies.
 */

import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './slices/authenticated-user';
import dataReducer from './slices/data';
import uiReducer from './slices/ui';

/*
 * Configure store.
 */

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    data: dataReducer,
    ui: uiReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
