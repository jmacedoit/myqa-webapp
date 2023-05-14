
/*
 * Module dependencies.
 */

import { KnowledgeBase, KnowledgeBasePatch } from 'src/types/knowledge-bases';
import { Organization } from 'src/types/organizations';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Resource } from 'src/types/resources';
import { RootState } from 'src/state/store';

/*
 * Data slice.
 */

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    organizations: [] as Organization[],
    knowledgeBases: [] as KnowledgeBase[],
    knowledgeBaseResources: {} as {
      [knowledgeBaseId: string]: Resource[]
    }
  },
  reducers: {
    setOrganizationsAction: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    setKnowledgeBasesAction: (state, action: PayloadAction<KnowledgeBase[]>) => {
      state.knowledgeBases = action.payload;
    },
    setKnowledgeBaseResourcesAction: (state, action: PayloadAction<{ knowledgeBaseId: string, resources: Resource[] }>) => {
      state.knowledgeBaseResources[action.payload.knowledgeBaseId] = action.payload.resources;
    },
    createKnowledgeBaseResourceAction: (state, action: PayloadAction<{ knowledgeBaseId: string, resource: Resource }>) => {
      const knowledgeBaseResources = state.knowledgeBaseResources[action.payload.knowledgeBaseId];

      state.knowledgeBaseResources[action.payload.knowledgeBaseId] = [action.payload.resource, ...knowledgeBaseResources];
    },
    deleteKnowledgeBaseResourceAction: (state, action: PayloadAction<{ knowledgeBaseId: string, resourceId: string }>) => {
      const knowledgeBaseResources = state.knowledgeBaseResources[action.payload.knowledgeBaseId];

      state.knowledgeBaseResources[action.payload.knowledgeBaseId] = knowledgeBaseResources.filter(resource => resource.id !== action.payload.resourceId);
    },
    createKnowledgeBaseAction: (state, action: PayloadAction<KnowledgeBase>) => {
      state.knowledgeBases.unshift(action.payload);
    },
    updateKnowledgeBaseAction: (state, action: PayloadAction<{ id: string, modifications: KnowledgeBasePatch }>) => {
      const knowledgeBaseIndex = state.knowledgeBases.findIndex(knowledgeBase => knowledgeBase.id === action.payload.id);

      if (knowledgeBaseIndex !== -1) {
        Object.assign(state.knowledgeBases[knowledgeBaseIndex], action.payload.modifications);
      }
    },
    deleteKnowledgeBaseAction: (state, action: PayloadAction<string>) => {
      state.knowledgeBases = state.knowledgeBases.filter(knowledgeBase => knowledgeBase.id !== action.payload);
    }
  }
});

/*
 * Export actions, selector and reducer.
 */

export const {
  createKnowledgeBaseAction,
  createKnowledgeBaseResourceAction: createKnowledgeBaseResourceAction,
  deleteKnowledgeBaseAction: deleteKnowledgeBaseAction,
  deleteKnowledgeBaseResourceAction: deleteKnowledgeBaseResourceAction,
  setKnowledgeBaseResourcesAction: setKnowledgeBaseResourcesAction,
  setKnowledgeBasesAction: setKnowledgeBasesAction,
  setOrganizationsAction: setOrganizationsAction,
  updateKnowledgeBaseAction
} = dataSlice.actions;

export const selectKnowledgeBases = (state: RootState) => state.data.knowledgeBases;
export const selectActiveOrganizationKnowledgeBases = (state: RootState) => {
  return state.data.knowledgeBases.filter(knowledgeBase => knowledgeBase.organization.id === state.ui.activeOrganizationId);
};
export const selectOrganizations = (state: RootState) => state.data.organizations;
export const selectResources = (knowledgeBaseId: string) => (state: RootState) => state.data.knowledgeBaseResources[knowledgeBaseId];

export default dataSlice.reducer;

