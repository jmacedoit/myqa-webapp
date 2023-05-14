
/*
 * Module dependencies.
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/state/store';

/*
 * Ui slice.
 */

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeOrganizationId: null as string | null
  },
  reducers: {
    setActiveOrganizationId: (state, action: PayloadAction<string | null>) => {
      state.activeOrganizationId = action.payload;
    }
  }
});

/*
 * Export actions, selector and reducer.
 */

export const { setActiveOrganizationId } = uiSlice.actions;

export const selectActiveOrganizationId = (state: RootState) => state.ui.activeOrganizationId;
export const selectActiveOrganization = (state: RootState) => state.data.organizations.find(organization => organization.id === state.ui.activeOrganizationId);

export default uiSlice.reducer;

