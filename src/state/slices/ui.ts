
/*
 * Module dependencies.
 */

import { NotificationMessage } from 'src/types/notification';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/state/store';

/*
 * Ui slice.
 */

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeOrganizationId: null as string | null,
    notifications: [] as NotificationMessage[]
  },
  reducers: {
    setActiveOrganizationId: (state, action: PayloadAction<string | null>) => {
      state.activeOrganizationId = action.payload;
    },
    addNotification: (state, action: PayloadAction<NotificationMessage>) => {
      state.notifications.push({
        id: Math.random().toString(36).substring(2, 9),
        ...action.payload
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    }
  }
});

/*
 * Export actions, selector and reducer.
 */

export const { addNotification, removeNotification, setActiveOrganizationId } = uiSlice.actions;

export const selectActiveOrganizationId = (state: RootState) => state.ui.activeOrganizationId;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectActiveOrganization = (state: RootState) => state.data.organizations.find(organization => organization.id === state.ui.activeOrganizationId);

export default uiSlice.reducer;

