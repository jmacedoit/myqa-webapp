
/*
 * Module dependencies.
 */

import { AnswerSourceData } from 'src/types/answer';
import { ChatSession, Message } from 'src/types/chat';
import { KnowledgeBase, KnowledgeBasePatch } from 'src/types/knowledge-bases';
import { Organization } from 'src/types/organizations';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Resource } from 'src/types/resources';
import { RootState } from 'src/state/store';
import { sortBy } from 'lodash';

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
    },
    chatSessions: {} as {
      [chatSessionId: string]: ChatSession
    },
    answersSourcesData: {} as {
      [messageId: string]: AnswerSourceData[]
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
    },
    createChatSessionAction: (state, action: PayloadAction<ChatSession>) => {
      state.chatSessions[action.payload.id] = action.payload;
    },
    addChatSessionsAction: (state, action: PayloadAction<ChatSession[]>) => {
      action.payload.forEach(chatSession => {
        state.chatSessions[chatSession.id] = chatSession;
      });
    },
    deleteChatSessionAction: (state, action: PayloadAction<string>) => {
      delete state.chatSessions[action.payload];
    },
    addMessageToChatSessionAction: (state, action: PayloadAction<{ chatSessionId: string, message: Message }>) => {
      const chatSession = state.chatSessions[action.payload.chatSessionId];

      if (chatSession) {
        chatSession.chatMessages = chatSession.chatMessages || [];

        chatSession.chatMessages.push(action.payload.message);
      }
    },
    setAnswerSourcesDataAction: (state, action: PayloadAction<{ messageId: string, answerSourcesData: AnswerSourceData[] }>) => {
      state.answersSourcesData[action.payload.messageId] = action.payload.answerSourcesData;
    }
  }
});

/*
 * Export actions, selector and reducer.
 */

export const {
  addChatSessionsAction,
  addMessageToChatSessionAction,
  createChatSessionAction,
  createKnowledgeBaseAction,
  createKnowledgeBaseResourceAction,
  deleteChatSessionAction,
  deleteKnowledgeBaseAction,
  deleteKnowledgeBaseResourceAction,
  setAnswerSourcesDataAction,
  setKnowledgeBaseResourcesAction,
  setKnowledgeBasesAction,
  setOrganizationsAction,
  updateKnowledgeBaseAction
} = dataSlice.actions;

export const selectKnowledgeBases = (state: RootState) => state.data.knowledgeBases;
export const selectActiveOrganizationKnowledgeBases = (state: RootState) => {
  return state.data.knowledgeBases.filter(knowledgeBase => knowledgeBase.organization.id === state.ui.activeOrganizationId);
};
export const selectOrganizations = (state: RootState) => state.data.organizations;
export const selectResources = (knowledgeBaseId: string) => (state: RootState) => state.data.knowledgeBaseResources[knowledgeBaseId];
export const selectChatSession = (chatSessionId: string) => (state: RootState) => state.data.chatSessions[chatSessionId];
export const selectChatSessions = (state: RootState) => sortBy(Object.values(state.data.chatSessions), 'updatedAt').reverse();

export default dataSlice.reducer;

